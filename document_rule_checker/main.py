#!/usr/bin/env python3
"""
Document Rule Checker - メインスクリプト
PDFやWord文書の文章ルール違反をチェックするツール
"""

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv

from file_reader import read_document
from rule_checker import check_document, load_rules, filter_violations_by_severity


# 色付き出力用のANSIコード
class Colors:
    RED = '\033[91m'
    YELLOW = '\033[93m'
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    RESET = '\033[0m'


def print_header(text: str) -> None:
    """ヘッダーを表示する"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'=' * 60}{Colors.RESET}\n")


def print_violation(violation, index: int) -> None:
    """違反を整形して表示する"""
    severity_colors = {
        'high': Colors.RED,
        'medium': Colors.YELLOW,
        'low': Colors.CYAN
    }
    severity_labels = {
        'high': '高',
        'medium': '中',
        'low': '低'
    }

    color = severity_colors.get(violation.severity, Colors.RESET)
    label = severity_labels.get(violation.severity, '不明')

    print(f"{Colors.BOLD}[{index}] {violation.rule_id}: {violation.rule_name}{Colors.RESET}")
    print(f"    重要度: {color}{label}{Colors.RESET}")
    print(f"    {Colors.BOLD}違反箇所:{Colors.RESET}")
    print(f"      {Colors.RED}\"{violation.location}\"{Colors.RESET}")
    print(f"    {Colors.BOLD}理由:{Colors.RESET}")
    print(f"      {violation.reason}")
    print(f"    {Colors.BOLD}修正案:{Colors.RESET}")
    print(f"      {Colors.GREEN}{violation.suggestion}{Colors.RESET}")
    print()


def print_summary(violations: list, severity_counts: dict) -> None:
    """サマリーを表示する"""
    print(f"{Colors.BOLD}--- 検出結果サマリー ---{Colors.RESET}")
    print(f"  違反総数: {len(violations)}件")
    print(f"    - 高 (High):   {Colors.RED}{severity_counts.get('high', 0)}件{Colors.RESET}")
    print(f"    - 中 (Medium): {Colors.YELLOW}{severity_counts.get('medium', 0)}件{Colors.RESET}")
    print(f"    - 低 (Low):    {Colors.CYAN}{severity_counts.get('low', 0)}件{Colors.RESET}")


def main():
    # 環境変数の読み込み
    load_dotenv()

    # コマンドライン引数の解析
    parser = argparse.ArgumentParser(
        description='PDFやWord文書の文章ルール違反をチェックするツール',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python main.py document.pdf
  python main.py report.docx --rules custom_rules.json
  python main.py document.pdf --severity medium
  python main.py document.pdf --output results.json
        """
    )

    parser.add_argument(
        'file',
        help='チェック対象のファイル（PDF または Word .docx）'
    )
    parser.add_argument(
        '--rules', '-r',
        help='カスタムルールファイルのパス（デフォルト: rules.json）',
        default=None
    )
    parser.add_argument(
        '--severity', '-s',
        choices=['high', 'medium', 'low'],
        default='low',
        help='表示する最低重要度（デフォルト: low = すべて表示）'
    )
    parser.add_argument(
        '--output', '-o',
        help='結果をJSONファイルに出力',
        default=None
    )
    parser.add_argument(
        '--quiet', '-q',
        action='store_true',
        help='詳細な出力を抑制'
    )

    args = parser.parse_args()

    # ファイルの存在確認
    file_path = Path(args.file)
    if not file_path.exists():
        print(f"{Colors.RED}エラー: ファイルが見つかりません: {args.file}{Colors.RESET}")
        sys.exit(1)

    # ルールファイルの読み込み
    try:
        rules = load_rules(args.rules)
        if not args.quiet:
            print(f"{Colors.GREEN}ルールファイルを読み込みました（{len(rules['rules'])}件のルール）{Colors.RESET}")
    except FileNotFoundError as e:
        print(f"{Colors.RED}エラー: ルールファイルが見つかりません: {e}{Colors.RESET}")
        sys.exit(1)
    except Exception as e:
        print(f"{Colors.RED}エラー: ルールファイルの読み込みに失敗: {e}{Colors.RESET}")
        sys.exit(1)

    # ファイルの読み込み
    if not args.quiet:
        print_header(f"ファイル読み込み: {file_path.name}")

    try:
        text = read_document(str(file_path))
        if not args.quiet:
            print(f"{Colors.GREEN}テキスト抽出完了（{len(text)}文字）{Colors.RESET}")
    except (FileNotFoundError, ValueError) as e:
        print(f"{Colors.RED}エラー: {e}{Colors.RESET}")
        sys.exit(1)

    # 文章チェック
    if not args.quiet:
        print_header("文章ルールチェック実行中...")
        print("Claude APIに問い合わせています...")

    try:
        violations = check_document(text, rules)
    except Exception as e:
        print(f"{Colors.RED}エラー: チェックに失敗しました: {e}{Colors.RESET}")
        sys.exit(1)

    # 重要度でフィルタリング
    filtered_violations = filter_violations_by_severity(violations, args.severity)

    # 重要度別のカウント
    severity_counts = {}
    for v in violations:
        severity_counts[v.severity] = severity_counts.get(v.severity, 0) + 1

    # 結果の表示
    if not args.quiet:
        print_header("チェック結果")

    if not filtered_violations:
        print(f"{Colors.GREEN}違反は検出されませんでした。{Colors.RESET}")
    else:
        for i, violation in enumerate(filtered_violations, 1):
            print_violation(violation, i)

        print_summary(violations, severity_counts)

    # JSON出力
    if args.output:
        import json
        output_data = {
            'file': str(file_path),
            'total_violations': len(violations),
            'violations': [
                {
                    'rule_id': v.rule_id,
                    'rule_name': v.rule_name,
                    'location': v.location,
                    'reason': v.reason,
                    'suggestion': v.suggestion,
                    'severity': v.severity
                }
                for v in violations
            ]
        }
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print(f"\n{Colors.GREEN}結果をJSONファイルに保存しました: {args.output}{Colors.RESET}")

    # 終了コード（違反があれば1、なければ0）
    sys.exit(1 if violations else 0)


if __name__ == "__main__":
    main()
