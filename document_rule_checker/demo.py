#!/usr/bin/env python3
"""
デモスクリプト - インストール不要で動作確認できます
"""

from offline_checker import check_document_offline

# サンプル文章（問題のある文章の例）
sample_text = """
本製品は高性能です。しかし、価格も高い。
このツールを使用することができます。
サーバにユーザーがアクセスすると、サーバーがレスポンスを返します。
お客様がおっしゃられました。
これは非常に長い文章であり、読者にとって理解しにくい可能性があるため、適切な箇所で区切ることが望ましいと考えられますが、このまま続けてしまうと更に読みにくくなってしまいます。
"""

print("=" * 60)
print("Document Rule Checker - デモ")
print("=" * 60)
print("\n【チェック対象の文章】")
print(sample_text)
print("\n" + "=" * 60)
print("【チェック結果】")
print("=" * 60 + "\n")

# オフラインチェック実行
violations = check_document_offline(sample_text)

if not violations:
    print("違反は検出されませんでした。")
else:
    for i, v in enumerate(violations, 1):
        print(f"[{i}] {v.rule_id}: {v.rule_name}")
        print(f"    重要度: {v.severity}")
        print(f"    違反箇所: {v.location}")
        print(f"    理由: {v.reason}")
        print(f"    修正案: {v.suggestion}")
        print()

    print(f"--- 合計 {len(violations)} 件の違反が見つかりました ---")
