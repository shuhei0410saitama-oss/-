#!/usr/bin/env python3
"""
Document Rule Checker - メインスクリプト
PDFやWord文書の文章ルール違反をチェックするツール
"""

import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from file_reader import read_document
from rule_checker import (
    check_document,
    load_rules,
    load_rules_from_text_file,
    create_rules_from_text,
    filter_violations_by_severity,
)
from offline_checker import check_document_offline


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


def print_summary(violations: list, severity_counts: dict, mode: str = "API") -> None:
    """サマリーを表示する"""
    print(f"{Colors.BOLD}--- 検出結果サマリー ({mode}モード) ---{Colors.RESET}")
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
  # 基本的な使い方（APIモード）
  python main.py document.pdf
  python main.py report.docx

  # APIキーなしで使う（オフラインモード）
  python main.py document.pdf --offline

  # ルールを直接指定
  python main.py document.pdf --rule-text "です・ます調で統一"

  # ルールをテキストファイルから読み込む
  python main.py document.pdf --rule-file my_rules.txt

  # JSONルールファイルを使用
  python main.py document.pdf --rules custom_rules.json

  # 結果をJSONに保存
  python main.py document.pdf --output results.json
        """
    )

    parser.add_argument(
        'file',
        help='チェック対象のファイル（PDF または Word .docx）'
    )

    # ルール指定オプション
    rule_group = parser.add_argument_group('ルール指定')
    rule_group.add_argument(
        '--rules', '-r',
        help='JSONルールファイルのパス（デフォルト: rules.json）',
        default=None
    )
    rule_group.add_argument(
        '--rule-file', '-rf',
        help='テキスト形式のルールファイル（1行1ルール）',
        default=None
    )
    rule_group.add_argument(
        '--rule-text', '-rt',
        action='append',
        help='ルールを直接指定（複数指定可）',
        default=[]
    )

    # モード指定
    mode_group = parser.add_argument_group('動作モード')
    mode_group.add_argument(
        '--offline',
        action='store_true',
        help='APIを使わない簡易チェックモード（APIキー不要）'
    )

    # 出力オプション
    output_group = parser.add_argument_group('出力オプション')
    output_group.add_argument(
        '--severity', '-s',
        choices=['high', 'medium', 'low'],
        default='low',
        help='表示する最低重要度（デフォルト: low = すべて表示）'
    )
    output_group.add_argument(
        '--output', '-o',
        help='結果をJSONファイルに出力',
        default=None
    )
    output_group.add_argument(
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

    # オフラインモードの判定（APIキーがない場合も自動的にオフラインモードに）
    use_offline = args.offline
    if not use_offline and not os.environ.get('ANTHROPIC_API_KEY'):
        if not args.quiet:
            print(f"{Colors.YELLOW}注意: APIキーが設定されていないため、オフラインモードで実行します。{Colors.RESET}")
            print(f"{Colors.YELLOW}      高精度なチェックには ANTHROPIC_API_KEY を設定してください。{Colors.RESET}\n")
        use_offline = True

    # ルールの読み込み（オフラインモード以外の場合）
    rules = None
    if not use_offline:
        try:
            # ルールの優先順位: --rule-text > --rule-file > --rules > デフォルト
            if args.rule_text:
                rules = create_rules_from_text(args.rule_text)
                if not args.quiet:
                    print(f"{Colors.GREEN}テキストからルールを作成しました（{len(rules['rules'])}件）{Colors.RESET}")
            elif args.rule_file:
                rules = load_rules_from_text_file(args.rule_file)
                if not args.quiet:
                    print(f"{Colors.GREEN}ルールファイルを読み込みました: {args.rule_file}（{len(rules['rules'])}件）{Colors.RESET}")
            else:
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
        if use_offline:
            print_header("オフラインモードでチェック中...")
            print("正規表現ベースの簡易チェックを実行しています...")
        else:
            print_header("文章ルールチェック実行中...")
            print("Claude APIに問い合わせています...")

    try:
        if use_offline:
            violations = check_document_offline(text)
        else:
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

        mode_name = "オフライン" if use_offline else "API"
        print_summary(violations, severity_counts, mode_name)

    # JSON出力
    if args.output:
        output_data = {
            'file': str(file_path),
            'mode': 'offline' if use_offline else 'api',
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
