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
 * 要素の詳細情報を取得（HTML・CSS図解用）
 * @param {HTMLElement} element - 情報を取得する要素
 * @returns {Object} 要素の詳細情報
 */
function getElementInfo(element) {
  // Computed Styleを取得
  const computedStyle = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  // ボックスモデル情報
  const boxModel = {
    width: rect.width,
    height: rect.height,
    margin: {
      top: parseFloat(computedStyle.marginTop),
      right: parseFloat(computedStyle.marginRight),
      bottom: parseFloat(computedStyle.marginBottom),
      left: parseFloat(computedStyle.marginLeft)
    },
    border: {
      top: parseFloat(computedStyle.borderTopWidth),
      right: parseFloat(computedStyle.borderRightWidth),
      bottom: parseFloat(computedStyle.borderBottomWidth),
      left: parseFloat(computedStyle.borderLeftWidth)
    },
    padding: {
      top: parseFloat(computedStyle.paddingTop),
      right: parseFloat(computedStyle.paddingRight),
      bottom: parseFloat(computedStyle.paddingBottom),
      left: parseFloat(computedStyle.paddingLeft)
    }
  };

  // 全てのCSSプロパティを取得（カテゴリ分け用）
  const cssProperties = {
    // レイアウト
    display: computedStyle.display,
    position: computedStyle.position,
    float: computedStyle.float,
    clear: computedStyle.clear,
    zIndex: computedStyle.zIndex,
    overflow: computedStyle.overflow,
    overflowX: computedStyle.overflowX,
    overflowY: computedStyle.overflowY,

    // Flexbox
    flexDirection: computedStyle.flexDirection,
    flexWrap: computedStyle.flexWrap,
    justifyContent: computedStyle.justifyContent,
    alignItems: computedStyle.alignItems,
    alignContent: computedStyle.alignContent,
    flex: computedStyle.flex,
    flexGrow: computedStyle.flexGrow,
    flexShrink: computedStyle.flexShrink,
    flexBasis: computedStyle.flexBasis,
    order: computedStyle.order,

    // Grid
    gridTemplateColumns: computedStyle.gridTemplateColumns,
    gridTemplateRows: computedStyle.gridTemplateRows,
    gridGap: computedStyle.gridGap,
    gridColumn: computedStyle.gridColumn,
    gridRow: computedStyle.gridRow,

    // サイズ
    width: computedStyle.width,
    height: computedStyle.height,
    minWidth: computedStyle.minWidth,
    minHeight: computedStyle.minHeight,
    maxWidth: computedStyle.maxWidth,
    maxHeight: computedStyle.maxHeight,
    boxSizing: computedStyle.boxSizing,

    // 配置
    top: computedStyle.top,
    right: computedStyle.right,
    bottom: computedStyle.bottom,
    left: computedStyle.left,

    // テキスト
    color: computedStyle.color,
    fontSize: computedStyle.fontSize,
    fontFamily: computedStyle.fontFamily,
    fontWeight: computedStyle.fontWeight,
    fontStyle: computedStyle.fontStyle,
    lineHeight: computedStyle.lineHeight,
    textAlign: computedStyle.textAlign,
    textDecoration: computedStyle.textDecoration,
    textTransform: computedStyle.textTransform,
    letterSpacing: computedStyle.letterSpacing,
    wordSpacing: computedStyle.wordSpacing,

    // 背景
    backgroundColor: computedStyle.backgroundColor,
    backgroundImage: computedStyle.backgroundImage,
    backgroundSize: computedStyle.backgroundSize,
    backgroundPosition: computedStyle.backgroundPosition,
    backgroundRepeat: computedStyle.backgroundRepeat,

    // ボーダー
    borderStyle: computedStyle.borderStyle,
    borderColor: computedStyle.borderColor,
    borderRadius: computedStyle.borderRadius,
    borderTopLeftRadius: computedStyle.borderTopLeftRadius,
    borderTopRightRadius: computedStyle.borderTopRightRadius,
    borderBottomLeftRadius: computedStyle.borderBottomLeftRadius,
    borderBottomRightRadius: computedStyle.borderBottomRightRadius,

    // エフェクト
    opacity: computedStyle.opacity,
    boxShadow: computedStyle.boxShadow,
    textShadow: computedStyle.textShadow,
    transform: computedStyle.transform,
    transition: computedStyle.transition,
    animation: computedStyle.animation,
    filter: computedStyle.filter,

    // その他
    cursor: computedStyle.cursor,
    pointerEvents: computedStyle.pointerEvents,
    visibility: computedStyle.visibility,
  };

  // HTML情報
  const htmlInfo = {
    tagName: element.tagName.toLowerCase(),
    id: element.id || '',
    classes: Array.from(element.classList),
    attributes: Array.from(element.attributes).map(attr => ({
      name: attr.name,
      value: attr.value
    }))
  };

  // セレクタパス
  const selectorPath = generateSelectorPath(element);

  // 階層情報（親と子）
  const hierarchy = {
    parent: element.parentElement ? getSimpleElementInfo(element.parentElement) : null,
    children: Array.from(element.children).slice(0, 20).map(child => getSimpleElementInfo(child)),
    siblings: element.parentElement ?
      Array.from(element.parentElement.children)
        .filter(el => el !== element)
        .slice(0, 10)
        .map(sib => getSimpleElementInfo(sib)) : []
  };

  // テキスト内容（短縮版）
  const textContent = element.textContent.trim().substring(0, 200);

  return {
    boxModel,
    cssProperties,
    htmlInfo,
    selectorPath,
    hierarchy,
    textContent
  };
}

/**
 * 簡易要素情報を取得（階層表示用）
 */
function getSimpleElementInfo(element) {
  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || '',
    classes: Array.from(element.classList),
    textContent: element.textContent.trim().substring(0, 50)
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
