#!/usr/bin/env python3
"""
ここから直接実行できます: python run_demo.py
"""
import sys
sys.path.insert(0, './document_rule_checker')

from offline_checker import check_document_offline

# サンプル文章
sample_text = """
本製品は高性能です。しかし、価格も高い。
このツールを使用することができます。
サーバにユーザーがアクセスすると、サーバーがレスポンスを返します。
お客様がおっしゃられました。
"""

print("=" * 50)
print("  文書ルールチェッカー デモ")
print("=" * 50)
print("\n【サンプル文章】")
print(sample_text)
print("【チェック結果】\n")

violations = check_document_offline(sample_text)

for i, v in enumerate(violations, 1):
    print(f"[{i}] {v.rule_name}")
    print(f"    違反: {v.location}")
    print(f"    修正案: {v.suggestion}\n")

print(f"合計 {len(violations)} 件の問題が見つかりました")
