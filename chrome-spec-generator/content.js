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
 * 要素のコンテンツ情報を取得
 * @param {HTMLElement} element - 情報を取得する要素
 * @returns {Object} 要素のコンテンツ情報
 */
function getElementInfo(element) {
  // 見出しを抽出
  const headings = [];
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  headingTags.forEach(tag => {
    const elements = element.querySelectorAll(tag);
    elements.forEach(el => {
      const text = el.textContent.trim();
      if (text) {
        headings.push({
          level: tag,
          text: text,
          order: headings.length + 1
        });
      }
    });
  });

  // 段落を抽出
  const paragraphs = [];
  const pElements = element.querySelectorAll('p');
  pElements.forEach((p, index) => {
    const text = p.textContent.trim();
    if (text && text.length > 10) {
      paragraphs.push({
        index: index + 1,
        text: text.substring(0, 300)
      });
    }
  });

  // リストを抽出
  const lists = [];
  const listElements = element.querySelectorAll('ul, ol');
  listElements.forEach((list, index) => {
    const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim());
    if (items.length > 0) {
      lists.push({
        type: list.tagName.toLowerCase(),
        items: items
      });
    }
  });

  // キーワードを抽出（太字、強調、リンク）
  const keywords = new Set();

  // 太字・強調
  element.querySelectorAll('strong, b, em, i').forEach(el => {
    const text = el.textContent.trim();
    if (text && text.length < 50) {
      keywords.add(text);
    }
  });

  // リンクテキスト
  element.querySelectorAll('a').forEach(a => {
    const text = a.textContent.trim();
    if (text && text.length < 50) {
      keywords.add(text);
    }
  });

  // 画像情報
  const images = [];
  element.querySelectorAll('img').forEach(img => {
    images.push({
      alt: img.alt || '',
      src: img.src || '',
      title: img.title || ''
    });
  });

  // メインテキスト
  const mainText = element.textContent.trim();

  // タイトル（最初の見出しまたはタグ名）
  let title = '';
  if (headings.length > 0) {
    title = headings[0].text;
  } else if (element.getAttribute('title')) {
    title = element.getAttribute('title');
  } else {
    title = `<${element.tagName.toLowerCase()}>`;
  }

  // 構造情報
  const structure = {
    tagName: element.tagName.toLowerCase(),
    id: element.id || '',
    classes: Array.from(element.classList),
    hasHeadings: headings.length > 0,
    hasParagraphs: paragraphs.length > 0,
    hasLists: lists.length > 0,
    hasImages: images.length > 0
  };

  return {
    title,
    mainText: mainText.substring(0, 1000),
    headings,
    paragraphs,
    lists,
    keywords: Array.from(keywords).slice(0, 20),
    images: images.slice(0, 5),
    structure,
    wordCount: mainText.split(/\s+/).length,
    charCount: mainText.length
  };
}

/**
 * 要素のセレクタパスを生成
 * @param {HTMLElement} element - 対象要素
 * @returns {string} CSSセレクタパス
 */
function generateSelectorPath(element) {
  const path = [];
  let current = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    } else if (current.className) {
      const classes = Array.from(current.classList).join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
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

  console.log('CSS図解ツール: 要素がクリックされました', event.target);

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

  console.log('CSS図解ツール: 選択モード開始');
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

  console.log('CSS図解ツール: 選択モード終了');
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
console.log('CSS図解ツール: content script loaded');
