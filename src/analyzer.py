"""
株価関連ニュース分析モジュール
ニュースを分析し、株価への影響度をスコアリングする
"""

import re
from typing import Optional
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import (
    STOCK_KEYWORDS_JA,
    STOCK_KEYWORDS_EN,
    HIGH_IMPACT_KEYWORDS,
    IMPACT_WEIGHTS,
)
from src.news_fetcher import NewsItem


class NewsAnalyzer:
    """ニュース分析クラス"""

    # カテゴリ分類のキーワード
    CATEGORY_KEYWORDS = {
        "決算・業績": ["決算", "業績", "利益", "売上", "earnings", "revenue", "profit", "guidance"],
        "金融政策": ["金利", "利上げ", "利下げ", "金融政策", "fed", "日銀", "boj", "ecb", "rate"],
        "M&A・事業再編": ["買収", "合併", "M&A", "提携", "acquisition", "merger", "partnership"],
        "市場動向": ["株価", "相場", "日経", "ダウ", "stock", "market", "index", "rally", "selloff"],
        "為替": ["円高", "円安", "為替", "ドル", "forex", "currency", "dollar", "yen"],
        "経済指標": ["GDP", "インフレ", "雇用", "CPI", "inflation", "unemployment", "economic"],
        "地政学リスク": ["地政学", "紛争", "戦争", "制裁", "geopolitical", "conflict", "war", "sanction"],
        "企業ニュース": ["新製品", "事業拡大", "撤退", "product", "expansion", "launch"],
    }

    def __init__(self):
        """初期化"""
        # キーワードを小文字に変換してセットに格納
        self.keywords_ja = set(k.lower() for k in STOCK_KEYWORDS_JA)
        self.keywords_en = set(k.lower() for k in STOCK_KEYWORDS_EN)
        self.high_impact_keywords = set(k.lower() for k in HIGH_IMPACT_KEYWORDS)

    def analyze(self, news_item: NewsItem) -> NewsItem:
        """
        単一のニュースアイテムを分析

        Args:
            news_item: 分析対象のニュースアイテム

        Returns:
            分析結果を含むNewsItem
        """
        # タイトルと説明文を結合して分析
        text = f"{news_item.title} {news_item.description}".lower()

        # マッチしたキーワードを収集
        matched = []

        # 日本語キーワードのチェック
        for keyword in self.keywords_ja:
            if keyword in text:
                matched.append(keyword)

        # 英語キーワードのチェック
        for keyword in self.keywords_en:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
                matched.append(keyword)

        # 重複を除去
        news_item.matched_keywords = list(set(matched))

        # 影響度スコアを計算
        news_item.impact_score = self._calculate_impact_score(text, matched)

        # カテゴリを判定
        news_item.category = self._determine_category(text)

        return news_item

    def _calculate_impact_score(self, text: str, matched_keywords: list) -> int:
        """
        影響度スコアを計算

        Args:
            text: 分析対象テキスト
            matched_keywords: マッチしたキーワードリスト

        Returns:
            影響度スコア（0-100）
        """
        score = 0

        # キーワードマッチ数に応じた基本スコア
        score += len(matched_keywords) * 5

        # 高影響キーワードのボーナス
        for keyword in self.high_impact_keywords:
            if keyword in text:
                score += IMPACT_WEIGHTS["high"] * 10

        # スコアを0-100に正規化
        return min(score, 100)

    def _determine_category(self, text: str) -> str:
        """
        ニュースのカテゴリを判定

        Args:
            text: 分析対象テキスト

        Returns:
            カテゴリ名
        """
        category_scores = {}

        for category, keywords in self.CATEGORY_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw.lower() in text)
            if score > 0:
                category_scores[category] = score

        if category_scores:
            return max(category_scores, key=category_scores.get)

        return "その他"

    def filter_stock_related(
        self,
        news_items: list[NewsItem],
        min_score: int = 10
    ) -> list[NewsItem]:
        """
        株価関連ニュースをフィルタリング

        Args:
            news_items: ニュースアイテムのリスト
            min_score: 最小影響度スコア

        Returns:
            フィルタリングされたNewsItemリスト
        """
        analyzed = []

        for item in news_items:
            analyzed_item = self.analyze(item)
            if analyzed_item.impact_score >= min_score:
                analyzed.append(analyzed_item)

        # 影響度スコアで降順ソート
        analyzed.sort(key=lambda x: x.impact_score, reverse=True)

        return analyzed

    def categorize(self, news_items: list[NewsItem]) -> dict[str, list[NewsItem]]:
        """
        ニュースをカテゴリ別に分類

        Args:
            news_items: 分析済みニュースアイテムのリスト

        Returns:
            カテゴリ別のNewsItemリスト
        """
        categories = {}

        for item in news_items:
            category = item.category or "その他"
            if category not in categories:
                categories[category] = []
            categories[category].append(item)

        return categories


if __name__ == "__main__":
    # テスト実行
    from src.news_fetcher import NewsFetcher

    fetcher = NewsFetcher()
    analyzer = NewsAnalyzer()

    # ニュースを取得
    news = fetcher.fetch_all(max_age_hours=48)

    # 株価関連ニュースをフィルタリング
    stock_news = analyzer.filter_stock_related(news, min_score=10)

    print(f"\n--- 株価関連ニュース ({len(stock_news)}件) ---")
    for item in stock_news[:10]:
        print(f"\n[スコア: {item.impact_score}] [{item.category}]")
        print(f"  {item.title}")
        print(f"  キーワード: {', '.join(item.matched_keywords[:5])}")
