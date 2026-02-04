"""
オフラインチェックモジュール
APIなしで正規表現ベースの簡易チェックを行う
"""

import re
from dataclasses import dataclass


@dataclass
class Violation:
    """ルール違反を表すデータクラス"""
    rule_id: str
    rule_name: str
    location: str
    reason: str
    suggestion: str
    severity: str


def check_style_consistency(text: str) -> list[Violation]:
    """語尾の統一をチェック（です・ます調 vs だ・である調）"""
    violations = []

    # 文を分割
    sentences = re.split(r'[。！？\n]', text)

    desu_masu_count = 0
    da_dearu_count = 0
    desu_masu_examples = []
    da_dearu_examples = []

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        # です・ます調
        if re.search(r'(です|ます|ました|ません|でした|でしょう)$', sentence):
            desu_masu_count += 1
            if len(desu_masu_examples) < 2:
                desu_masu_examples.append(sentence)

        # だ・である調
        if re.search(r'(だ|である|だった|ない|た|る)$', sentence):
            # 「〜ている」「〜される」などは除外
            if not re.search(r'(ている|される|られる|している)$', sentence):
                da_dearu_count += 1
                if len(da_dearu_examples) < 2:
                    da_dearu_examples.append(sentence)

    # 両方が一定数以上あれば混在とみなす
    if desu_masu_count >= 2 and da_dearu_count >= 2:
        violations.append(Violation(
            rule_id="OFFLINE001",
            rule_name="語尾の統一",
            location=f"です・ます調: 「{desu_masu_examples[0][:30]}...」など{desu_masu_count}件 / だ・である調: 「{da_dearu_examples[0][:30]}...」など{da_dearu_count}件",
            reason="「です・ます調」と「だ・である調」が混在しています",
            suggestion="どちらか一方の文体に統一してください",
            severity="high"
        ))

    return violations


def check_notation_inconsistency(text: str) -> list[Violation]:
    """表記ゆれをチェック"""
    violations = []

    # チェックする表記ゆれパターン
    patterns = [
        (r'サーバ[^ー]', r'サーバー', 'サーバ/サーバー'),
        (r'ユーザ[^ー]', r'ユーザー', 'ユーザ/ユーザー'),
        (r'コンピュータ[^ー]', r'コンピューター', 'コンピュータ/コンピューター'),
        (r'プリンタ[^ー]', r'プリンター', 'プリンタ/プリンター'),
        (r'ブラウザ[^ー]', r'ブラウザー', 'ブラウザ/ブラウザー'),
        (r'フォルダ[^ー]', r'フォルダー', 'フォルダ/フォルダー'),
    ]

    for short_pattern, long_pattern, name in patterns:
        short_matches = re.findall(short_pattern, text)
        long_matches = re.findall(long_pattern, text)

        if short_matches and long_matches:
            violations.append(Violation(
                rule_id="OFFLINE002",
                rule_name="表記ゆれ",
                location=f"「{name}」が混在（短い表記: {len(short_matches)}件、長い表記: {len(long_matches)}件）",
                reason=f"同じ単語の表記が統一されていません",
                suggestion=f"「{name.split('/')[1]}」のように長音記号ありで統一することをおすすめします",
                severity="medium"
            ))

    return violations


def check_redundant_expressions(text: str) -> list[Violation]:
    """冗長表現をチェック"""
    violations = []

    patterns = [
        (r'することができ(る|ます)', '〜することができる', '〜できる'),
        (r'ということ', '〜ということ', '〜こと（または削除）'),
        (r'についての', '〜についての', '〜の'),
        (r'によって行(う|われ)', '〜によって行う', '〜で行う/〜する'),
        (r'を行(う|い)', '〜を行う', '〜する'),
    ]

    for pattern, bad, good in patterns:
        matches = re.findall(pattern, text)
        if matches:
            # 該当箇所を特定
            found = re.search(f'.{{0,20}}{pattern}.{{0,20}}', text)
            location = found.group(0) if found else bad

            violations.append(Violation(
                rule_id="OFFLINE003",
                rule_name="冗長表現",
                location=f"「{location}」など{len(matches)}件",
                reason=f"「{bad}」は冗長な表現です",
                suggestion=f"「{good}」のように簡潔に書き換えてください",
                severity="low"
            ))

    return violations


def check_double_honorifics(text: str) -> list[Violation]:
    """二重敬語をチェック"""
    violations = []

    patterns = [
        (r'おっしゃられ', 'おっしゃられる', 'おっしゃる'),
        (r'お見えになられ', 'お見えになられる', 'お見えになる/いらっしゃる'),
        (r'お帰りになられ', 'お帰りになられる', 'お帰りになる'),
        (r'ご覧になられ', 'ご覧になられる', 'ご覧になる'),
        (r'お召し上がりになられ', 'お召し上がりになられる', '召し上がる'),
    ]

    for pattern, bad, good in patterns:
        if re.search(pattern, text):
            found = re.search(f'.{{0,15}}{pattern}.{{0,15}}', text)
            location = found.group(0) if found else bad

            violations.append(Violation(
                rule_id="OFFLINE004",
                rule_name="二重敬語",
                location=f"「{location}」",
                reason=f"「{bad}」は二重敬語です",
                suggestion=f"「{good}」が正しい敬語です",
                severity="medium"
            ))

    return violations


def check_long_sentences(text: str, max_length: int = 100) -> list[Violation]:
    """長すぎる文をチェック"""
    violations = []

    sentences = re.split(r'[。！？]', text)

    long_sentences = []
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) > max_length:
            long_sentences.append(sentence)

    if long_sentences:
        violations.append(Violation(
            rule_id="OFFLINE005",
            rule_name="長すぎる文",
            location=f"「{long_sentences[0][:50]}...」など{len(long_sentences)}件",
            reason=f"{max_length}文字を超える長い文があります",
            suggestion="文を分割して読みやすくしてください",
            severity="low"
        ))

    return violations


def check_document_offline(text: str) -> list[Violation]:
    """
    オフラインでドキュメントをチェックする（メイン関数）

    Args:
        text: チェック対象のテキスト

    Returns:
        違反のリスト
    """
    violations = []

    violations.extend(check_style_consistency(text))
    violations.extend(check_notation_inconsistency(text))
    violations.extend(check_redundant_expressions(text))
    violations.extend(check_double_honorifics(text))
    violations.extend(check_long_sentences(text))

    return violations


if __name__ == "__main__":
    # テスト用コード
    test_text = """
    本製品は高性能です。しかし、価格も高い。
    このツールを使用することができます。
    サーバにユーザーがアクセスすると、サーバーがレスポンスを返します。
    お客様がおっしゃられました。
    これは非常に長い文章であり、読者にとって理解しにくい可能性があるため、適切な箇所で区切ることが望ましいと考えられますが、このまま続けてしまうと更に読みにくくなってしまいます。
    """

    print("オフラインモードでテスト中...")
    violations = check_document_offline(test_text)
    print(f"\n{len(violations)}件の違反が見つかりました。\n")

    for v in violations:
        print(f"[{v.rule_id}] {v.rule_name}")
        print(f"  違反箇所: {v.location}")
        print(f"  理由: {v.reason}")
        print(f"  修正案: {v.suggestion}")
        print()
