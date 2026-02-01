#!/usr/bin/env python3
"""
株価変動関連ニュース キュレーター

世界中のニュースソースから株価に影響しそうなニュースを
収集・分析・キュレーションするツール

使用方法:
    python main.py                    # 基本実行（コンソール出力）
    python main.py --format markdown  # Markdown形式で出力
    python main.py --format json      # JSON形式で出力
    python main.py --format html      # HTML形式で出力
    python main.py --hours 48         # 過去48時間のニュースを取得
    python main.py --min-score 20     # 最小影響度スコアを20に設定
"""

import argparse
from datetime import datetime
import sys
import os

# プロジェクトルートをパスに追加
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.news_fetcher import NewsFetcher
from src.analyzer import NewsAnalyzer
from src.curator import NewsCurator
from config import RSS_FEEDS


def main():
    """メイン関数"""
    parser = argparse.ArgumentParser(
        description="株価変動関連ニュース キュレーター"
    )
    parser.add_argument(
        "--format", "-f",
        choices=["console", "markdown", "json", "html"],
        default="console",
        help="出力フォーマット (default: console)"
    )
    parser.add_argument(
        "--output", "-o",
        help="出力ファイルパス (指定しない場合は標準出力)"
    )
    parser.add_argument(
        "--hours", "-t",
        type=int,
        default=24,
        help="取得するニュースの最大経過時間 (default: 24)"
    )
    parser.add_argument(
        "--min-score", "-s",
        type=int,
        default=10,
        help="最小影響度スコア (default: 10)"
    )
    parser.add_argument(
        "--max-per-category", "-m",
        type=int,
        default=10,
        help="カテゴリごとの最大表示件数 (default: 10)"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="詳細ログを表示"
    )

    args = parser.parse_args()

    print("=" * 60)
    print("  株価変動関連ニュース キュレーター")
    print("=" * 60)
    print()

    # ニュース取得
    fetcher = NewsFetcher(feeds=RSS_FEEDS)
    all_news = fetcher.fetch_all(max_age_hours=args.hours)

    if not all_news:
        print("ニュースを取得できませんでした。")
        print("ネットワーク接続を確認してください。")
        sys.exit(1)

    # 分析
    print("\nニュースを分析中...")
    analyzer = NewsAnalyzer()
    stock_news = analyzer.filter_stock_related(all_news, min_score=args.min_score)
    categories = analyzer.categorize(stock_news)

    print(f"株価関連ニュース: {len(stock_news)}件を検出")

    # キュレーション・出力
    curator = NewsCurator(max_per_category=args.max_per_category)

    if args.format == "console":
        curator.print_summary(stock_news, categories)
    else:
        # ファイル出力
        if args.format == "markdown":
            output = curator.to_markdown(stock_news, categories)
            ext = ".md"
        elif args.format == "json":
            output = curator.to_json(stock_news, categories)
            ext = ".json"
        elif args.format == "html":
            output = curator.to_html(stock_news, categories)
            ext = ".html"

        # 出力先の決定
        if args.output:
            output_path = args.output
        else:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = f"news_curation_{timestamp}{ext}"

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(output)

        print(f"\n出力ファイル: {output_path}")
        print(f"フォーマット: {args.format.upper()}")

    # 統計情報
    if args.verbose:
        print("\n--- 詳細統計 ---")
        print(f"取得ニュース総数: {len(all_news)}")
        print(f"株価関連ニュース: {len(stock_news)}")
        print(f"フィルタ率: {len(stock_news)/len(all_news)*100:.1f}%")

        print("\nカテゴリ別内訳:")
        for cat, items in sorted(categories.items(), key=lambda x: -len(x[1])):
            avg_score = sum(i.impact_score for i in items) / len(items) if items else 0
            print(f"  {cat}: {len(items)}件 (平均スコア: {avg_score:.1f})")

    print("\n完了しました。")


if __name__ == "__main__":
    main()
