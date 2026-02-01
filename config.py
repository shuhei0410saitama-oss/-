"""
ニュース株価キュレーター設定ファイル
"""

# ニュースソースのRSSフィード
RSS_FEEDS = {
    # 日本語ニュース
    "日経新聞": "https://www.nikkei.com/rss/main.xml",
    "ロイター日本語": "https://jp.reuters.com/rssFeed/topNews",
    "Bloomberg日本語": "https://www.bloomberg.co.jp/feeds/sitemap_news.xml",

    # 英語ニュース（グローバル）
    "Reuters Business": "https://feeds.reuters.com/reuters/businessNews",
    "Reuters World": "https://feeds.reuters.com/Reuters/worldNews",
    "CNBC": "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    "MarketWatch": "https://feeds.marketwatch.com/marketwatch/topstories/",
    "Financial Times": "https://www.ft.com/rss/home",
    "Yahoo Finance": "https://finance.yahoo.com/news/rssindex",
    "BBC Business": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "CNN Business": "http://rss.cnn.com/rss/money_news_international.rss",
}

# 株価に影響を与えやすいキーワード（日本語）
STOCK_KEYWORDS_JA = [
    # 企業活動
    "決算", "業績", "利益", "売上", "増収", "減収", "増益", "減益",
    "上方修正", "下方修正", "配当", "株主還元", "自社株買い",
    "M&A", "買収", "合併", "提携", "事業売却", "事業再編",
    "新製品", "新サービス", "事業拡大", "撤退",

    # 市場動向
    "株価", "株式市場", "相場", "日経平均", "TOPIX", "東証",
    "ダウ", "S&P", "ナスダック", "NYSE",
    "上昇", "下落", "急騰", "急落", "暴落", "反発",
    "円高", "円安", "為替", "ドル円",

    # 経済指標
    "GDP", "金利", "インフレ", "デフレ", "景気", "雇用統計",
    "CPI", "消費者物価", "失業率", "貿易収支",

    # 政策・規制
    "金融政策", "利上げ", "利下げ", "量的緩和", "日銀", "FRB",
    "規制", "法改正", "補助金", "関税", "制裁",

    # リスク要因
    "リスク", "危機", "破綻", "倒産", "不正", "訴訟",
    "地政学", "紛争", "戦争", "パンデミック",
]

# 株価に影響を与えやすいキーワード（英語）
STOCK_KEYWORDS_EN = [
    # Corporate activities
    "earnings", "revenue", "profit", "loss", "guidance",
    "dividend", "buyback", "acquisition", "merger", "IPO",
    "partnership", "restructuring", "layoff", "expansion",

    # Market movements
    "stock", "shares", "market", "index", "rally", "selloff",
    "bull", "bear", "volatility", "trading",
    "dow", "s&p", "nasdaq", "ftse", "nikkei",

    # Economic indicators
    "gdp", "inflation", "deflation", "interest rate", "employment",
    "unemployment", "cpi", "ppi", "retail sales", "housing",

    # Policy & regulation
    "fed", "ecb", "boj", "rate hike", "rate cut",
    "quantitative easing", "tapering", "regulation", "tariff", "sanction",

    # Risk factors
    "crisis", "bankruptcy", "default", "fraud", "lawsuit",
    "geopolitical", "conflict", "war", "pandemic", "recession",
]

# ニュースの影響度スコア設定
IMPACT_WEIGHTS = {
    "high": 3,      # 高影響（決算、金融政策、M&Aなど）
    "medium": 2,    # 中影響（市場動向、経済指標など）
    "low": 1,       # 低影響（一般的なビジネスニュース）
}

# 高影響キーワード
HIGH_IMPACT_KEYWORDS = [
    "決算", "earnings", "金融政策", "fed", "利上げ", "rate hike",
    "買収", "acquisition", "merger", "M&A", "破綻", "bankruptcy",
    "上方修正", "下方修正", "guidance", "危機", "crisis",
]

# 出力設定
OUTPUT_FORMAT = "markdown"  # markdown, json, html
MAX_NEWS_PER_CATEGORY = 10
