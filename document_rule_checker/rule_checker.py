"""
ルールチェックモジュール
Claude APIを使用して文章ルールの違反をチェックする機能を提供
"""

import json
from dataclasses import dataclass
from pathlib import Path

import anthropic


@dataclass
class Violation:
    """ルール違反を表すデータクラス"""
    rule_id: str
    rule_name: str
    location: str
    reason: str
    suggestion: str
    severity: str


def load_rules(rules_path: str = None) -> dict:
    """
    ルールファイルを読み込む

    Args:
        rules_path: ルールファイルのパス（省略時はデフォルトのrules.jsonを使用）

    Returns:
        ルール設定の辞書
    """
    if rules_path is None:
        rules_path = Path(__file__).parent / "rules.json"

    with open(rules_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_rules_from_text_file(file_path: str) -> dict:
    """
    テキストファイルからルールを読み込む（1行1ルール形式）

    Args:
        file_path: テキストファイルのパス

    Returns:
        ルール設定の辞書
    """
    rules = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if line and not line.startswith('#'):  # 空行とコメント行をスキップ
                rules.append({
                    "id": f"TEXT{i:03d}",
                    "name": line[:20] + "..." if len(line) > 20 else line,
                    "description": line,
                    "severity": "medium",
                    "examples": {"bad": "", "good": ""}
                })

    return {"rules": rules, "settings": {"check_all_rules": True}}


def create_rules_from_text(rule_texts: list[str]) -> dict:
    """
    テキストのリストからルール辞書を作成する

    Args:
        rule_texts: ルールテキストのリスト

    Returns:
        ルール設定の辞書
    """
    rules = []
    for i, text in enumerate(rule_texts, 1):
        text = text.strip()
        if text:
            rules.append({
                "id": f"CUSTOM{i:03d}",
                "name": text[:20] + "..." if len(text) > 20 else text,
                "description": text,
                "severity": "medium",
                "examples": {"bad": "", "good": ""}
            })

    return {"rules": rules, "settings": {"check_all_rules": True}}


def build_check_prompt(text: str, rules: dict) -> str:
    """
    ルールチェック用のプロンプトを構築する

    Args:
        text: チェック対象のテキスト
        rules: ルール設定

    Returns:
        Claude APIに送信するプロンプト
    """
    rules_description = []
    for rule in rules['rules']:
        rule_text = f"""
【{rule['id']}: {rule['name']}】
- 説明: {rule['description']}
- 重要度: {rule['severity']}
- 悪い例: {rule['examples']['bad']}
- 良い例: {rule['examples']['good']}
"""
        rules_description.append(rule_text)

    prompt = f"""以下の文章を、指定されたルールに基づいてチェックしてください。

## チェックルール
{"".join(rules_description)}

## チェック対象の文章
---
{text}
---

## 出力形式
違反箇所がある場合は、以下のJSON形式で出力してください。
違反がない場合は空の配列 [] を返してください。

```json
[
  {{
    "rule_id": "ルールID（例: R001）",
    "rule_name": "ルール名",
    "location": "違反箇所の引用（該当する文章の一部）",
    "reason": "なぜこれがルール違反なのかの説明",
    "suggestion": "具体的な修正案",
    "severity": "重要度（high/medium/low）"
  }}
]
```

重要:
- 各違反について、具体的な修正案を必ず提示してください
- 違反箇所は原文からそのまま引用してください
- JSONのみを出力し、他の説明は不要です
"""
    return prompt


def check_document(text: str, rules: dict = None, api_key: str = None) -> list[Violation]:
    """
    Claude APIを使用して文章をチェックする

    Args:
        text: チェック対象のテキスト
        rules: ルール設定（省略時はデフォルトのルールを使用）
        api_key: Anthropic APIキー（省略時は環境変数から取得）

    Returns:
        違反のリスト
    """
    if rules is None:
        rules = load_rules()

    # APIクライアントの初期化
    client = anthropic.Anthropic(api_key=api_key)

    # プロンプトの構築
    prompt = build_check_prompt(text, rules)

    # APIリクエスト
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    # レスポンスの解析
    response_text = message.content[0].text

    # JSONを抽出
    try:
        # コードブロックからJSONを抽出
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            json_str = response_text[json_start:json_end].strip()
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            json_str = response_text[json_start:json_end].strip()
        else:
            json_str = response_text.strip()

        violations_data = json.loads(json_str)

    except json.JSONDecodeError:
        # JSONのパースに失敗した場合は空のリストを返す
        print(f"警告: レスポンスのパースに失敗しました: {response_text[:200]}...")
        return []

    # Violationオブジェクトに変換
    violations = []
    for v in violations_data:
        violations.append(Violation(
            rule_id=v.get('rule_id', 'Unknown'),
            rule_name=v.get('rule_name', 'Unknown'),
            location=v.get('location', ''),
            reason=v.get('reason', ''),
            suggestion=v.get('suggestion', ''),
            severity=v.get('severity', 'medium')
        ))

    return violations


def filter_violations_by_severity(
    violations: list[Violation],
    threshold: str = 'low'
) -> list[Violation]:
    """
    重要度に基づいて違反をフィルタリングする

    Args:
        violations: 違反のリスト
        threshold: 表示する最低重要度（high/medium/low）

    Returns:
        フィルタリングされた違反のリスト
    """
    severity_order = {'high': 3, 'medium': 2, 'low': 1}
    threshold_level = severity_order.get(threshold, 1)

    return [
        v for v in violations
        if severity_order.get(v.severity, 1) >= threshold_level
    ]


if __name__ == "__main__":
    # テスト用コード
    test_text = """
    本製品は高性能です。しかし、価格も高い。
    このツールを使用することができます。
    サーバにユーザーがアクセスすると、サーバーがレスポンスを返します。
    """

    print("テストテキストをチェック中...")
    try:
        violations = check_document(test_text)
        print(f"\n{len(violations)}件の違反が見つかりました。")
        for v in violations:
            print(f"\n[{v.rule_id}] {v.rule_name}")
            print(f"  違反箇所: {v.location}")
            print(f"  理由: {v.reason}")
            print(f"  修正案: {v.suggestion}")
    except anthropic.AuthenticationError:
        print("エラー: APIキーが設定されていないか、無効です。")
        print("環境変数 ANTHROPIC_API_KEY を設定してください。")
