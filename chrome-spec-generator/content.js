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

// 範囲選択用の変数
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragSelectionBox = null;

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
 * 範囲選択ボックスを作成
 */
function createDragSelectionBox() {
  if (dragSelectionBox) return dragSelectionBox;

  const box = document.createElement('div');
  box.id = 'drag-selection-box';
  box.style.cssText = `
    position: absolute;
    pointer-events: none;
    z-index: 2147483646;
    background-color: rgba(102, 126, 234, 0.2);
    border: 2px dashed #667eea;
    box-sizing: border-box;
    display: none;
  `;
  document.body.appendChild(box);
  dragSelectionBox = box;
  return box;
}

/**
 * 範囲選択ボックスを削除
 */
function removeDragSelectionBox() {
  if (dragSelectionBox && dragSelectionBox.parentNode) {
    dragSelectionBox.parentNode.removeChild(dragSelectionBox);
    dragSelectionBox = null;
  }
}

/**
 * 範囲内の要素を取得
 */
function getElementsInRange(x1, y1, x2, y2) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  // 範囲内のすべての要素を取得
  const allElements = document.querySelectorAll('*');
  const elementsInRange = [];

  allElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    // 要素の中心が範囲内にあるかチェック
    if (elementCenterX >= minX && elementCenterX <= maxX &&
        elementCenterY >= minY && elementCenterY <= maxY) {
      elementsInRange.push(element);
    }
  });

  return elementsInRange;
}

/**
 * 範囲内の要素から仮想的なコンテナを作成
 */
function createVirtualContainer(elements) {
  console.log('仮想コンテナ作成:', elements.length, '個の要素');

  // すべての要素のテキストを結合
  const allText = elements.map(el => el.textContent).join('\n');

  // 仮想的なコンテナオブジェクトを作成
  const container = {
    querySelectorAll: (selector) => {
      const results = [];
      elements.forEach(el => {
        try {
          // 要素自身がセレクタにマッチするかチェック
          if (el.matches && el.matches(selector)) {
            results.push(el);
          }
          // 子要素を検索
          const found = el.querySelectorAll(selector);
          results.push(...Array.from(found));
        } catch (e) {
          // セレクタエラーを無視
          console.warn('querySelectorAll エラー:', selector, e);
        }
      });
      return results;
    },
    textContent: allText,
    tagName: 'VIRTUAL',
    toLowerCase: () => 'virtual'
  };

  // tagName.toLowerCase()メソッドを追加
  container.tagName = {
    toLowerCase: () => 'virtual'
  };

  return container;
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

  // elementTagを安全に取得
  let elementTag = 'unknown';
  try {
    if (typeof element.tagName === 'string') {
      elementTag = element.tagName.toLowerCase();
    } else if (element.tagName && typeof element.tagName.toLowerCase === 'function') {
      elementTag = element.tagName.toLowerCase();
    }
  } catch (e) {
    console.warn('elementTag取得エラー:', e);
  }

  const result = {
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
    elementTag,
    elementText: element.textContent.trim().substring(0, 300)
  };

  console.log('getElementInfo完了:', {
    cards: cards.length,
    headings: headings.length,
    paragraphs: paragraphs.length,
    textLength: element.textContent.length
  });

  return result;
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

  // 選択要素自体が見出しの場合も含める（仮想コンテナではスキップ）
  try {
    const tagName = typeof element.tagName === 'string' ? element.tagName.toLowerCase() :
                    (element.tagName && typeof element.tagName.toLowerCase === 'function' ? element.tagName.toLowerCase() : '');
    if (tagName && headingTags.includes(tagName)) {
      const text = element.textContent.trim();
      if (text) {
        headings.unshift({
          level: parseInt(tagName.charAt(1)),
          text: text,
          tag: tagName
        });
      }
    }
  } catch (e) {
    console.warn('見出し自身チェックエラー:', e);
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

  // 選択要素自体がpタグの場合（仮想コンテナではスキップ）
  try {
    const tagName = typeof element.tagName === 'string' ? element.tagName.toLowerCase() :
                    (element.tagName && typeof element.tagName.toLowerCase === 'function' ? element.tagName.toLowerCase() : '');
    if (tagName === 'p') {
      const text = element.textContent.trim();
      if (text && text.length > 10) {
        paragraphs.unshift({ text, length: text.length });
      }
    }
  } catch (e) {
    console.warn('段落自身チェックエラー:', e);
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
 * 右クリックドラッグ開始
 */
function handleMouseDown(event) {
  if (!isSelectionMode) return;
  if (event.button !== 2) return; // 右クリックのみ

  event.preventDefault();
  event.stopPropagation();

  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;

  const box = createDragSelectionBox();
  box.style.left = `${dragStartX}px`;
  box.style.top = `${dragStartY}px`;
  box.style.width = '0px';
  box.style.height = '0px';
  box.style.display = 'block';

  // 通常のハイライトを非表示
  hideHighlight();
}

/**
 * ドラッグ中の処理
 */
function handleMouseMove(event) {
  if (!isSelectionMode || !isDragging) return;

  event.preventDefault();

  const currentX = event.clientX;
  const currentY = event.clientY;

  const box = dragSelectionBox;
  const minX = Math.min(dragStartX, currentX);
  const minY = Math.min(dragStartY, currentY);
  const width = Math.abs(currentX - dragStartX);
  const height = Math.abs(currentY - dragStartY);

  box.style.left = `${minX}px`;
  box.style.top = `${minY}px`;
  box.style.width = `${width}px`;
  box.style.height = `${height}px`;
}

/**
 * ドラッグ終了
 */
async function handleMouseUp(event) {
  if (!isSelectionMode || !isDragging) return;
  if (event.button !== 2) return;

  event.preventDefault();
  event.stopPropagation();

  const endX = event.clientX;
  const endY = event.clientY;

  // 最小サイズチェック（10px未満は無視）
  const width = Math.abs(endX - dragStartX);
  const height = Math.abs(endY - dragStartY);

  if (width < 10 || height < 10) {
    isDragging = false;
    removeDragSelectionBox();
    return;
  }

  console.log('コンテンツ図解ツール: 範囲選択完了', { dragStartX, dragStartY, endX, endY });

  // 範囲内の要素を取得
  const elementsInRange = getElementsInRange(dragStartX, dragStartY, endX, endY);
  console.log('選択された要素数:', elementsInRange.length);

  // 仮想コンテナを作成
  const virtualContainer = createVirtualContainer(elementsInRange);

  // 選択モードを終了
  isDragging = false;
  stopSelectionMode();

  // 要素の情報を取得
  const elementInfo = getElementInfo(virtualContainer);

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
 * コンテキストメニューを無効化
 */
function handleContextMenu(event) {
  if (!isSelectionMode) return;
  event.preventDefault();
  event.stopPropagation();
}

/**
 * 選択モードを開始
 */
function startSelectionMode() {
  isSelectionMode = true;

  // 通常のクリック選択
  document.addEventListener('mouseover', handleMouseOver, { capture: true, passive: false });
  document.addEventListener('click', handleClick, { capture: true, passive: false });

  // 右クリックドラッグ選択
  document.addEventListener('mousedown', handleMouseDown, { capture: true, passive: false });
  document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: false });
  document.addEventListener('mouseup', handleMouseUp, { capture: true, passive: false });
  document.addEventListener('contextmenu', handleContextMenu, { capture: true, passive: false });

  document.body.style.cursor = 'crosshair';
  createHighlightOverlay();

  console.log('コンテンツ図解ツール: 選択モード開始（クリック or 右クリックドラッグ）');
}

/**
 * 選択モードを終了
 */
function stopSelectionMode() {
  isSelectionMode = false;
  isDragging = false;

  // 通常選択のイベントリスナーを削除
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('click', handleClick, true);

  // 範囲選択のイベントリスナーを削除
  document.removeEventListener('mousedown', handleMouseDown, true);
  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('mouseup', handleMouseUp, true);
  document.removeEventListener('contextmenu', handleContextMenu, true);

  document.body.style.cursor = '';
  removeHighlightOverlay();
  removeDragSelectionBox();
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
