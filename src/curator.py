"""
キュレーション結果出力モジュール
分析結果を様々なフォーマットで出力する
"""

import json
from datetime import datetime
from typing import Optional
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.news_fetcher import NewsItem
from config import MAX_NEWS_PER_CATEGORY


class NewsCurator:
    """ニュースキュレーション出力クラス"""

    def __init__(self, max_per_category: int = MAX_NEWS_PER_CATEGORY):
        """
        Args:
            max_per_category: カテゴリごとの最大表示件数
        """
        self.max_per_category = max_per_category

    def to_markdown(
        self,
        news_items: list[NewsItem],
        categories: dict[str, list[NewsItem]] = None,
        title: str = "株価変動関連ニュース キュレーション"
    ) -> str:
        """
        Markdown形式で出力

        Args:
            news_items: ニュースアイテムのリスト
            categories: カテゴリ別ニュース（オプション）
            title: レポートタイトル

        Returns:
            Markdown形式の文字列
        """
        lines = []
        now = datetime.now().strftime("%Y-%m-%d %H:%M")

        # ヘッダー
        lines.append(f"# {title}")
        lines.append(f"\n**生成日時**: {now}")
        lines.append(f"**総ニュース数**: {len(news_items)}件\n")

        # サマリー統計
        lines.append("## サマリー")
        lines.append("")

        if categories:
            lines.append("| カテゴリ | 件数 |")
            lines.append("|----------|------|")
            for cat, items in sorted(categories.items(), key=lambda x: -len(x[1])):
                lines.append(f"| {cat} | {len(items)}件 |")
            lines.append("")

        # 高影響ニュース（トップ10）
        high_impact = [n for n in news_items if n.impact_score >= 50]
        if high_impact:
            lines.append("## 高影響ニュース")
            lines.append("")
            for item in high_impact[:10]:
                lines.append(self._format_news_item_md(item))
            lines.append("")

        # カテゴリ別ニュース
        if categories:
            lines.append("## カテゴリ別ニュース")
            lines.append("")

            for category, items in sorted(categories.items(), key=lambda x: -len(x[1])):
                lines.append(f"### {category}")
                lines.append("")

                for item in items[:self.max_per_category]:
                    lines.append(self._format_news_item_md(item))

                if len(items) > self.max_per_category:
                    lines.append(f"*...他 {len(items) - self.max_per_category}件*")
                lines.append("")

        return "\n".join(lines)

    def _format_news_item_md(self, item: NewsItem) -> str:
        """ニュースアイテムをMarkdown形式でフォーマット"""
        published = ""
        if item.published:
            published = item.published.strftime("%m/%d %H:%M")

        impact_bar = self._get_impact_bar(item.impact_score)

        lines = [
            f"- **[{item.title}]({item.link})**",
            f"  - 影響度: {impact_bar} ({item.impact_score}点)",
            f"  - ソース: {item.source} | {published}",
        ]

        if item.matched_keywords:
            keywords = ", ".join(item.matched_keywords[:5])
            lines.append(f"  - キーワード: {keywords}")

        if item.description:
            desc = item.description[:100] + "..." if len(item.description) > 100 else item.description
            lines.append(f"  - {desc}")

        lines.append("")
        return "\n".join(lines)

    def _get_impact_bar(self, score: int) -> str:
        """影響度スコアをバー形式で表示"""
        filled = score // 10
        empty = 10 - filled
        return "█" * filled + "░" * empty

    def to_json(
        self,
        news_items: list[NewsItem],
        categories: dict[str, list[NewsItem]] = None
    ) -> str:
        """
        JSON形式で出力

        Args:
            news_items: ニュースアイテムのリスト
            categories: カテゴリ別ニュース（オプション）

        Returns:
            JSON形式の文字列
        """
        data = {
            "generated_at": datetime.now().isoformat(),
            "total_count": len(news_items),
            "news": [],
            "categories": {}
        }

        for item in news_items:
            data["news"].append(self._item_to_dict(item))

        if categories:
            for cat, items in categories.items():
                data["categories"][cat] = [self._item_to_dict(i) for i in items]

        return json.dumps(data, ensure_ascii=False, indent=2)

    def _item_to_dict(self, item: NewsItem) -> dict:
        """NewsItemを辞書に変換"""
        return {
            "title": item.title,
            "description": item.description,
            "link": item.link,
            "source": item.source,
            "published": item.published.isoformat() if item.published else None,
            "category": item.category,
            "impact_score": item.impact_score,
            "matched_keywords": item.matched_keywords,
        }

    def to_html(
        self,
        news_items: list[NewsItem],
        categories: dict[str, list[NewsItem]] = None,
        title: str = "株価変動関連ニュース キュレーション"
    ) -> str:
        """
        HTML形式で出力

        Args:
            news_items: ニュースアイテムのリスト
            categories: カテゴリ別ニュース（オプション）
            title: レポートタイトル

        Returns:
            HTML形式の文字列
        """
        now = datetime.now().strftime("%Y-%m-%d %H:%M")

        html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        h1 {{ color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }}
        h2 {{ color: #555; margin-top: 30px; }}
        h3 {{ color: #666; }}
        .meta {{ color: #888; font-size: 0.9em; }}
        .news-item {{
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .news-item h4 {{ margin: 0 0 10px 0; }}
        .news-item a {{ color: #1a73e8; text-decoration: none; }}
        .news-item a:hover {{ text-decoration: underline; }}
        .impact-bar {{
            display: inline-block;
            width: 100px;
            height: 10px;
            background: #eee;
            border-radius: 5px;
            overflow: hidden;
        }}
        .impact-fill {{
            height: 100%;
            background: linear-gradient(90deg, #4caf50, #ff9800, #f44336);
        }}
        .keywords {{ color: #666; font-size: 0.85em; }}
        .source {{ color: #888; font-size: 0.85em; }}
        .high-impact {{ border-left: 4px solid #f44336; }}
        .category-badge {{
            display: inline-block;
            padding: 2px 8px;
            background: #e3f2fd;
            border-radius: 12px;
            font-size: 0.8em;
            color: #1565c0;
        }}
        .summary-table {{ width: 100%; border-collapse: collapse; }}
        .summary-table th, .summary-table td {{
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
    </style>
</head>
<body>
    <h1>{title}</h1>
    <p class="meta">生成日時: {now} | 総ニュース数: {len(news_items)}件</p>
"""

        # サマリー
        if categories:
            html += "<h2>サマリー</h2>\n<table class='summary-table'>\n"
            html += "<tr><th>カテゴリ</th><th>件数</th></tr>\n"
            for cat, items in sorted(categories.items(), key=lambda x: -len(x[1])):
                html += f"<tr><td>{cat}</td><td>{len(items)}件</td></tr>\n"
            html += "</table>\n"

        # 高影響ニュース
        high_impact = [n for n in news_items if n.impact_score >= 50]
        if high_impact:
            html += "<h2>高影響ニュース</h2>\n"
            for item in high_impact[:10]:
                html += self._format_news_item_html(item, high_impact=True)

        # カテゴリ別
        if categories:
            html += "<h2>カテゴリ別ニュース</h2>\n"
            for cat, items in sorted(categories.items(), key=lambda x: -len(x[1])):
                html += f"<h3>{cat} ({len(items)}件)</h3>\n"
                for item in items[:self.max_per_category]:
                    html += self._format_news_item_html(item)

        html += "</body></html>"
        return html

    def _format_news_item_html(self, item: NewsItem, high_impact: bool = False) -> str:
        """ニュースアイテムをHTML形式でフォーマット"""
        published = ""
        if item.published:
            published = item.published.strftime("%m/%d %H:%M")

        class_name = "news-item high-impact" if high_impact else "news-item"

        html = f"""<div class="{class_name}">
    <h4><a href="{item.link}" target="_blank">{item.title}</a></h4>
    <div class="impact-bar"><div class="impact-fill" style="width: {item.impact_score}%"></div></div>
    <span> {item.impact_score}点</span>
    <span class="category-badge">{item.category or 'その他'}</span>
    <p class="source">{item.source} | {published}</p>
"""
        if item.matched_keywords:
            keywords = ", ".join(item.matched_keywords[:5])
            html += f'    <p class="keywords">キーワード: {keywords}</p>\n'

        if item.description:
            desc = item.description[:150] + "..." if len(item.description) > 150 else item.description
            html += f"    <p>{desc}</p>\n"

        html += "</div>\n"
        return html

    def print_summary(self, news_items: list[NewsItem], categories: dict = None):
        """コンソールにサマリーを出力"""
        print("\n" + "=" * 60)
        print("  株価変動関連ニュース キュレーション")
        print("=" * 60)
        print(f"  生成日時: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print(f"  総ニュース数: {len(news_items)}件")
        print("-" * 60)

        if categories:
            print("\n  【カテゴリ別件数】")
            for cat, items in sorted(categories.items(), key=lambda x: -len(x[1])):
                bar = "■" * min(len(items), 20)
                print(f"    {cat:15s}: {bar} {len(items)}件")

        high_impact = [n for n in news_items if n.impact_score >= 50]
        if high_impact:
            print("\n  【高影響ニュース TOP5】")
            for i, item in enumerate(high_impact[:5], 1):
                print(f"    {i}. [{item.impact_score}点] {item.title[:50]}...")
                print(f"       {item.source} | {item.category}")

        print("\n" + "=" * 60)


if __name__ == "__main__":
    # テスト実行
    from src.news_fetcher import NewsFetcher
    from src.analyzer import NewsAnalyzer

    fetcher = NewsFetcher()
    analyzer = NewsAnalyzer()
    curator = NewsCurator()

    # ニュースを取得・分析
    news = fetcher.fetch_all(max_age_hours=48)
    stock_news = analyzer.filter_stock_related(news, min_score=10)
    categories = analyzer.categorize(stock_news)

    # サマリー出力
    curator.print_summary(stock_news, categories)

    # Markdown出力
    md = curator.to_markdown(stock_news, categories)
    with open("output.md", "w", encoding="utf-8") as f:
        f.write(md)
    print("\nMarkdownファイルを出力しました: output.md")
