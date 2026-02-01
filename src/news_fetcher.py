"""
ニュース取得モジュール
RSSフィードからニュースを収集する
"""

import xml.etree.ElementTree as ET
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import Optional
import time
import sys
import os
import re
from email.utils import parsedate_to_datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import RSS_FEEDS


@dataclass
class NewsItem:
    """ニュースアイテムのデータクラス"""
    title: str
    description: str
    link: str
    source: str
    published: Optional[datetime]
    category: Optional[str] = None
    impact_score: int = 0
    matched_keywords: list = None

    def __post_init__(self):
        if self.matched_keywords is None:
            self.matched_keywords = []


class NewsFetcher:
    """ニュース取得クラス"""

    # RSSの名前空間
    NAMESPACES = {
        'atom': 'http://www.w3.org/2005/Atom',
        'dc': 'http://purl.org/dc/elements/1.1/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
    }

    def __init__(self, feeds: dict = None, timeout: int = 10):
        """
        Args:
            feeds: RSSフィードの辞書 {ソース名: URL}
            timeout: リクエストのタイムアウト秒数
        """
        self.feeds = feeds or RSS_FEEDS
        self.timeout = timeout

    def fetch_feed(self, source: str, url: str) -> list[NewsItem]:
        """
        単一のRSSフィードからニュースを取得

        Args:
            source: ニュースソース名
            url: RSSフィードのURL

        Returns:
            NewsItemのリスト
        """
        news_items = []

        try:
            # URLからXMLを取得
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'NewsStockCurator/1.0 (Python)'}
            )
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                xml_content = response.read()

            # XMLを解析
            root = ET.fromstring(xml_content)

            # RSS 2.0形式
            if root.tag == 'rss':
                channel = root.find('channel')
                if channel is not None:
                    for item in channel.findall('item'):
                        news_item = self._parse_rss_item(item, source)
                        if news_item:
                            news_items.append(news_item)

            # Atom形式
            elif root.tag == '{http://www.w3.org/2005/Atom}feed':
                for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
                    news_item = self._parse_atom_entry(entry, source)
                    if news_item:
                        news_items.append(news_item)

            # RDF/RSS 1.0形式
            elif 'rdf' in root.tag.lower():
                for item in root.findall('.//{http://purl.org/rss/1.0/}item'):
                    news_item = self._parse_rdf_item(item, source)
                    if news_item:
                        news_items.append(news_item)

        except urllib.error.URLError as e:
            print(f"  [警告] {source}: 接続エラー - {str(e)}")
        except ET.ParseError as e:
            print(f"  [警告] {source}: XML解析エラー - {str(e)}")
        except Exception as e:
            print(f"  [エラー] {source}: {str(e)}")

        return news_items

    def _parse_rss_item(self, item: ET.Element, source: str) -> Optional[NewsItem]:
        """RSS 2.0のitemを解析"""
        title = self._get_text(item, 'title') or 'No Title'
        link = self._get_text(item, 'link') or ''
        description = self._get_text(item, 'description') or ''
        pub_date = self._get_text(item, 'pubDate')

        published = self._parse_date(pub_date)
        description = self._strip_html(description)

        return NewsItem(
            title=title,
            description=description[:500],
            link=link,
            source=source,
            published=published,
        )

    def _parse_atom_entry(self, entry: ET.Element, source: str) -> Optional[NewsItem]:
        """Atomのentryを解析"""
        ns = '{http://www.w3.org/2005/Atom}'

        title_elem = entry.find(f'{ns}title')
        title = title_elem.text if title_elem is not None else 'No Title'

        link_elem = entry.find(f'{ns}link')
        link = link_elem.get('href', '') if link_elem is not None else ''

        summary_elem = entry.find(f'{ns}summary')
        content_elem = entry.find(f'{ns}content')
        description = ''
        if summary_elem is not None and summary_elem.text:
            description = summary_elem.text
        elif content_elem is not None and content_elem.text:
            description = content_elem.text

        updated_elem = entry.find(f'{ns}updated')
        published_elem = entry.find(f'{ns}published')
        pub_date = None
        if published_elem is not None:
            pub_date = published_elem.text
        elif updated_elem is not None:
            pub_date = updated_elem.text

        published = self._parse_date(pub_date)
        description = self._strip_html(description)

        return NewsItem(
            title=title,
            description=description[:500],
            link=link,
            source=source,
            published=published,
        )

    def _parse_rdf_item(self, item: ET.Element, source: str) -> Optional[NewsItem]:
        """RDF/RSS 1.0のitemを解析"""
        ns_rss = '{http://purl.org/rss/1.0/}'
        ns_dc = '{http://purl.org/dc/elements/1.1/}'

        title_elem = item.find(f'{ns_rss}title')
        title = title_elem.text if title_elem is not None else 'No Title'

        link_elem = item.find(f'{ns_rss}link')
        link = link_elem.text if link_elem is not None else ''

        desc_elem = item.find(f'{ns_rss}description')
        description = desc_elem.text if desc_elem is not None else ''

        date_elem = item.find(f'{ns_dc}date')
        pub_date = date_elem.text if date_elem is not None else None

        published = self._parse_date(pub_date)
        description = self._strip_html(description or '')

        return NewsItem(
            title=title,
            description=description[:500],
            link=link,
            source=source,
            published=published,
        )

    def _get_text(self, element: ET.Element, tag: str) -> Optional[str]:
        """要素からテキストを取得"""
        child = element.find(tag)
        if child is not None and child.text:
            return child.text.strip()
        return None

    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime]:
        """日付文字列を解析"""
        if not date_str:
            return None

        try:
            # RFC 2822形式 (例: "Mon, 01 Jan 2024 12:00:00 GMT")
            return parsedate_to_datetime(date_str)
        except (ValueError, TypeError):
            pass

        try:
            # ISO 8601形式 (例: "2024-01-01T12:00:00Z")
            date_str = date_str.replace('Z', '+00:00')
            return datetime.fromisoformat(date_str)
        except (ValueError, TypeError):
            pass

        return None

    def fetch_all(self, max_age_hours: int = 24) -> list[NewsItem]:
        """
        すべてのRSSフィードからニュースを取得

        Args:
            max_age_hours: 取得するニュースの最大経過時間

        Returns:
            NewsItemのリスト（新しい順）
        """
        all_news = []
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)

        print(f"ニュースを取得中... ({len(self.feeds)}ソース)")

        for source, url in self.feeds.items():
            print(f"  - {source}")
            news_items = self.fetch_feed(source, url)

            # 時間でフィルタリング
            for item in news_items:
                if item.published is None or item.published.replace(tzinfo=None) > cutoff_time:
                    all_news.append(item)

            # レートリミット対策
            time.sleep(0.3)

        # 日付で降順ソート（新しい順）
        all_news.sort(
            key=lambda x: x.published.replace(tzinfo=None) if x.published else datetime.min,
            reverse=True
        )

        print(f"合計 {len(all_news)} 件のニュースを取得しました")
        return all_news

    def _strip_html(self, text: str) -> str:
        """HTMLタグを除去"""
        clean = re.compile('<.*?>')
        return re.sub(clean, '', text).strip()


if __name__ == "__main__":
    # テスト実行
    fetcher = NewsFetcher()
    news = fetcher.fetch_all(max_age_hours=48)

    print("\n--- 最新ニュース（上位10件） ---")
    for item in news[:10]:
        print(f"\n[{item.source}] {item.title}")
        print(f"  {item.published}")
        print(f"  {item.link}")
