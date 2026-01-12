/**
 * content.js
 * 役割: Webページに注入され、要素の選択とハイライト機能を提供
 * - マウスオーバーで要素をハイライト表示
 * - クリックで要素を選択
 * - 選択された要素の詳細情報（CSS、HTML構造など）を取得
 */

// グローバル変数
let isSelectionMode = false;
let highlightedElement = null;
let highlightOverlay = null;

/**
 * ハイライトオーバーレイを作成
 */
function createHighlightOverlay() {
  if (highlightOverlay) return highlightOverlay;

  const overlay = document.createElement('div');
  overlay.id = 'css-inspector-highlight';
  overlay.style.cssText = `
    position: absolute;
    pointer-events: none;
    z-index: 2147483647;
    background-color: rgba(33, 150, 243, 0.3);
    border: 2px solid #2196F3;
    box-sizing: border-box;
    transition: all 0.1s ease;
  `;
  document.body.appendChild(overlay);
  highlightOverlay = overlay;
  return overlay;
}

/**
 * ハイライトオーバーレイを削除
 */
function removeHighlightOverlay() {
  if (highlightOverlay && highlightOverlay.parentNode) {
    highlightOverlay.parentNode.removeChild(highlightOverlay);
    highlightOverlay = null;
  }
}

/**
 * 要素をハイライト表示
 * @param {HTMLElement} element - ハイライトする要素
 */
function highlightElement(element) {
  if (!element || element === document.body || element === document.documentElement) {
    return;
  }

  highlightedElement = element;
  const overlay = createHighlightOverlay();
  const rect = element.getBoundingClientRect();

  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.display = 'block';
}

/**
 * ハイライトを非表示
 */
function hideHighlight() {
  if (highlightOverlay) {
    highlightOverlay.style.display = 'none';
  }
  highlightedElement = null;
}

/**
 * 要素のコンテンツ情報を取得（内容図解用）
 * @param {HTMLElement} element - 情報を取得する要素
 * @returns {Object} 要素の内容情報
 */
function getElementInfo(element) {
  // ページタイトルを取得
  const pageTitle = document.title || '';

  // 見出し構造を取得
  const headings = extractHeadings(element);

  // 段落を取得
  const paragraphs = extractParagraphs(element);

  // リストを取得
  const lists = extractLists(element);

  // 画像を取得
  const images = extractImages(element);

  // リンクを取得
  const links = extractLinks(element);

  // 重要なキーワードを抽出
  const keywords = extractKeywords(element);

  // カード・ボックス要素を検出（視覚的に重要な要素）
  const cards = extractCards(element);

  // テーブルデータを取得
  const tables = extractTables(element);

  // セクション情報
  const sections = extractSections(element);

  return {
    pageTitle,
    headings,
    paragraphs,
    lists,
    images,
    links,
    keywords,
    cards,
    tables,
    sections,
    elementTag: element.tagName.toLowerCase(),
    elementText: element.textContent.trim().substring(0, 300)
  };
}

/**
 * 見出しを抽出
 */
function extractHeadings(element) {
  const headings = [];
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  headingTags.forEach(tag => {
    const elements = element.querySelectorAll(tag);
    elements.forEach((el, index) => {
      const text = el.textContent.trim();
      if (text) {
        headings.push({
          level: parseInt(tag.charAt(1)),
          text: text,
          tag: tag
        });
      }
    });
  });

  // 選択要素自体が見出しの場合も含める
  if (headingTags.includes(element.tagName.toLowerCase())) {
    const text = element.textContent.trim();
    if (text) {
      headings.unshift({
        level: parseInt(element.tagName.charAt(1)),
        text: text,
        tag: element.tagName.toLowerCase()
      });
    }
  }

  return headings.slice(0, 30); // 最大30個
}

/**
 * 段落を抽出
 */
function extractParagraphs(element) {
  const paragraphs = [];
  const pElements = element.querySelectorAll('p');

  pElements.forEach((p, index) => {
    const text = p.textContent.trim();
    if (text && text.length > 10) {
      paragraphs.push({
        text: text,
        length: text.length
      });
    }
  });

  // 選択要素自体がpタグの場合
  if (element.tagName.toLowerCase() === 'p') {
    const text = element.textContent.trim();
    if (text && text.length > 10) {
      paragraphs.unshift({ text, length: text.length });
    }
  }

  return paragraphs.slice(0, 20); // 最大20個
}

/**
 * リストを抽出
 */
function extractLists(element) {
  const lists = [];
  const listElements = element.querySelectorAll('ul, ol');

  listElements.forEach((list, index) => {
    const items = Array.from(list.children)
      .filter(li => li.tagName.toLowerCase() === 'li')
      .map(li => li.textContent.trim())
      .filter(text => text);

    if (items.length > 0) {
      lists.push({
        type: list.tagName.toLowerCase(),
        items: items.slice(0, 10)
      });
    }
  });

  return lists.slice(0, 10);
}

/**
 * 画像を抽出
 */
function extractImages(element) {
  const images = [];
  const imgElements = element.querySelectorAll('img');

  imgElements.forEach((img, index) => {
    const src = img.src || '';
    const alt = img.alt || '';
    if (src) {
      images.push({
        src: src,
        alt: alt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      });
    }
  });

  return images.slice(0, 15);
}

/**
 * リンクを抽出
 */
function extractLinks(element) {
  const links = [];
  const aElements = element.querySelectorAll('a[href]');

  aElements.forEach((a, index) => {
    const href = a.href;
    const text = a.textContent.trim();
    if (href && text) {
      links.push({
        url: href,
        text: text
      });
    }
  });

  return links.slice(0, 20);
}

/**
 * キーワードを抽出（頻出単語）
 */
function extractKeywords(element) {
  const text = element.textContent || '';
  const words = text
    .toLowerCase()
    .replace(/[^\w\sぁ-んァ-ヶー一-龠]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  // 単語の出現回数をカウント
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // 頻出単語を抽出（ストップワードを除外）
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'with', 'this', 'that', 'から', 'まで', 'など', 'として', 'について', 'により', 'による']);

  const keywords = Object.entries(wordCount)
    .filter(([word, count]) => count >= 2 && !stopWords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  return keywords;
}

/**
 * カード・ボックス要素を検出
 */
function extractCards(element) {
  const cards = [];

  // カード的な要素を検出（div, article, sectionなど）
  const cardSelectors = [
    '[class*="card"]',
    '[class*="box"]',
    '[class*="item"]',
    '[class*="panel"]',
    'article',
    '[class*="feature"]'
  ];

  cardSelectors.forEach(selector => {
    try {
      const elements = element.querySelectorAll(selector);
      elements.forEach((el, index) => {
        // 既に追加されていないかチェック
        if (cards.some(card => card.element === el)) return;
        if (cards.length >= 10) return;

        const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
        const headingText = heading ? heading.textContent.trim() : '';
        const text = el.textContent.trim();

        // 最初の100文字だけを取得（短く簡潔に）
        const shortText = text.substring(0, 100);

        // 数値や重要情報を抽出
        const highlights = extractHighlightsFromText(text);

        if (text.length > 20) {
          cards.push({
            element: el,
            heading: headingText,
            text: shortText,
            highlights: highlights,
            selector: selector
          });
        }
      });
    } catch (e) {
      // セレクタエラーを無視
    }
  });

  return cards.slice(0, 10).map(card => ({
    heading: card.heading,
    text: card.text,
    highlights: card.highlights
  }));
}

/**
 * テキストから重要な数値や情報を抽出
 */
function extractHighlightsFromText(text) {
  const highlights = [];

  // 金額を検出（円、万円、億円など）
  const moneyRegex = /([0-9,]+(?:\.[0-9]+)?)\s*(?:円|万円|億円|ドル|USD|JPY)/g;
  let match;
  while ((match = moneyRegex.exec(text)) !== null) {
    highlights.push({
      type: 'money',
      value: match[0]
    });
  }

  // パーセンテージを検出
  const percentRegex = /([0-9.]+)\s*(?:%|パーセント|percent)/g;
  while ((match = percentRegex.exec(text)) !== null) {
    highlights.push({
      type: 'percent',
      value: match[0]
    });
  }

  // 年数・期間を検出
  const periodRegex = /([0-9]+)\s*(?:年|ヶ月|か月|日|週間|days|months|years)/g;
  while ((match = periodRegex.exec(text)) !== null) {
    highlights.push({
      type: 'period',
      value: match[0]
    });
  }

  // 「無期限」「恒久化」などの重要キーワード
  const keywordRegex = /(無期限|恒久化|永久|無制限|最大|最小|最高|最低|新規|改正)/g;
  while ((match = keywordRegex.exec(text)) !== null) {
    highlights.push({
      type: 'keyword',
      value: match[0]
    });
  }

  return highlights.slice(0, 3); // 最大3つまで
}

/**
 * テーブルを抽出
 */
function extractTables(element) {
  const tables = [];
  const tableElements = element.querySelectorAll('table');

  tableElements.forEach((table, index) => {
    const headers = Array.from(table.querySelectorAll('th'))
      .map(th => th.textContent.trim());

    const rows = Array.from(table.querySelectorAll('tr'))
      .slice(0, 5)
      .map(tr => {
        return Array.from(tr.querySelectorAll('td'))
          .map(td => td.textContent.trim());
      })
      .filter(row => row.length > 0);

    if (headers.length > 0 || rows.length > 0) {
      tables.push({
        headers: headers,
        rows: rows
      });
    }
  });

  return tables.slice(0, 5);
}

/**
 * セクション構造を抽出
 */
function extractSections(element) {
  const sections = [];
  const sectionElements = element.querySelectorAll('section, article, [class*="section"]');

  sectionElements.forEach((section, index) => {
    const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
    const headingText = heading ? heading.textContent.trim() : '';
    const text = section.textContent.trim().substring(0, 200);

    if (headingText || text.length > 30) {
      sections.push({
        heading: headingText,
        text: text
      });
    }
  });

  return sections.slice(0, 10);
}


/**
 * マウスオーバーイベントハンドラ
 */
function handleMouseOver(event) {
  if (!isSelectionMode) return;

  event.stopPropagation();
  event.preventDefault();

  highlightElement(event.target);
}

/**
 * クリックイベントハンドラ
 */
async function handleClick(event) {
  if (!isSelectionMode) return;

  console.log('コンテンツ図解ツール: 要素がクリックされました', event.target);

  event.stopPropagation();
  event.preventDefault();
  event.stopImmediatePropagation();

  const element = event.target;

  // 選択モードを終了
  stopSelectionMode();

  // 要素の情報を取得
  const elementInfo = getElementInfo(element);

  // background scriptに情報を送信
  chrome.runtime.sendMessage({
    action: 'saveElementInfo',
    data: elementInfo
  });

  // popup.jsに要素が選択されたことを通知
  chrome.runtime.sendMessage({
    action: 'elementSelected'
  });
}

/**
 * 選択モードを開始
 */
function startSelectionMode() {
  isSelectionMode = true;

  // キャプチャフェーズで最優先でイベントを捕捉
  document.addEventListener('mouseover', handleMouseOver, { capture: true, passive: false });
  document.addEventListener('click', handleClick, { capture: true, passive: false });
  document.addEventListener('mousedown', handleClick, { capture: true, passive: false });

  document.body.style.cursor = 'crosshair';
  createHighlightOverlay();

  console.log('コンテンツ図解ツール: 選択モード開始');
}

/**
 * 選択モードを終了
 */
function stopSelectionMode() {
  isSelectionMode = false;
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('mousedown', handleClick, true);
  document.body.style.cursor = '';
  removeHighlightOverlay();
  hideHighlight();

  console.log('コンテンツ図解ツール: 選択モード終了');
}

/**
 * メッセージリスナー: popup.jsからのメッセージを受信
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSelection') {
    startSelectionMode();
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'cancelSelection') {
    stopSelectionMode();
    sendResponse({ success: true });
    return true;
  }
});

// content script読み込み完了のログ
console.log('コンテンツ図解ツール: content script loaded');
