/**
 * result.js
 * 役割: 選択された要素のHTML・CSS情報を視覚的に図解表示
 */

/**
 * 要素情報を表示
 * @param {Object} elementInfo - 要素情報
 */
function displayElementInfo(elementInfo) {
  console.log('Element Info:', elementInfo);

  // ヘッダー情報
  displayHeader(elementInfo);

  // ボックスモデル
  displayBoxModel(elementInfo.boxModel);

  // テキストコンテンツ
  displayTextContent(elementInfo.textContent);

  // HTML 階層構造
  displayHierarchy(elementInfo.hierarchy, elementInfo.htmlInfo);

  // Flexbox/Grid レイアウト
  displayLayout(elementInfo.cssProperties);

  // CSS プロパティ
  displayCSSProperties(elementInfo.cssProperties);

  // ローディングを非表示、コンテンツを表示
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';
}

/**
 * ヘッダー情報を表示
 * @param {Object} elementInfo - 要素情報
 */
function displayHeader(elementInfo) {
  const { htmlInfo, selectorPath } = elementInfo;

  document.getElementById('elementTag').textContent = `<${htmlInfo.tagName}>`;
  document.getElementById('selectorPath').textContent = selectorPath;
}

/**
 * ボックスモデルを表示
 * @param {Object} boxModel - ボックスモデル情報
 */
function displayBoxModel(boxModel) {
  const container = document.getElementById('boxModelContainer');

  // ボックスモデルのネスト構造を作成
  const boxHTML = `
    <div class="box-model">
      <div class="box-layer margin-box">
        <div class="box-label margin-label">Margin</div>
        <div class="box-values">
          ${boxModel.margin.top}px ${boxModel.margin.right}px ${boxModel.margin.bottom}px ${boxModel.margin.left}px
        </div>
        <div class="box-layer border-box">
          <div class="box-label border-label">Border</div>
          <div class="box-values">
            ${boxModel.border.top}px ${boxModel.border.right}px ${boxModel.border.bottom}px ${boxModel.border.left}px
          </div>
          <div class="box-layer padding-box">
            <div class="box-label padding-label">Padding</div>
            <div class="box-values">
              ${boxModel.padding.top}px ${boxModel.padding.right}px ${boxModel.padding.bottom}px ${boxModel.padding.left}px
            </div>
            <div class="box-layer content-box">
              <div class="box-label content-label">Content</div>
              <div>${Math.round(boxModel.width)}px × ${Math.round(boxModel.height)}px</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = boxHTML;

  // サイズ情報カード
  displaySizeInfo(boxModel);
}

/**
 * サイズ情報を表示
 * @param {Object} boxModel - ボックスモデル情報
 */
function displaySizeInfo(boxModel) {
  const sizeInfoContainer = document.getElementById('sizeInfo');

  const totalWidth = boxModel.width + boxModel.padding.left + boxModel.padding.right +
                     boxModel.border.left + boxModel.border.right +
                     boxModel.margin.left + boxModel.margin.right;

  const totalHeight = boxModel.height + boxModel.padding.top + boxModel.padding.bottom +
                      boxModel.border.top + boxModel.border.bottom +
                      boxModel.margin.top + boxModel.margin.bottom;

  const sizeCards = [
    { title: 'コンテンツ幅', value: `${Math.round(boxModel.width)}px` },
    { title: 'コンテンツ高さ', value: `${Math.round(boxModel.height)}px` },
    { title: '合計幅', value: `${Math.round(totalWidth)}px` },
    { title: '合計高さ', value: `${Math.round(totalHeight)}px` }
  ];

  const html = sizeCards.map(card => `
    <div class="size-card">
      <div class="size-card-title">${card.title}</div>
      <div class="size-card-value">${card.value}</div>
    </div>
  `).join('');

  sizeInfoContainer.innerHTML = html;
}

/**
 * テキストコンテンツを表示
 * @param {string} textContent - テキスト内容
 */
function displayTextContent(textContent) {
  const section = document.getElementById('textContentSection');
  const container = document.getElementById('textContent');

  if (!textContent || textContent.trim() === '') {
    section.style.display = 'none';
    return;
  }

  container.textContent = textContent;
}

/**
 * HTML 階層構造を表示
 * @param {Object} hierarchy - 階層情報
 * @param {Object} currentElement - 現在の要素情報
 */
function displayHierarchy(hierarchy, currentElement) {
  const container = document.getElementById('hierarchyContainer');

  let html = '';

  // 親要素
  if (hierarchy.parent) {
    html += `
      <div class="hierarchy-section">
        <div class="hierarchy-title">⬆️ 親要素</div>
        ${renderElementCard(hierarchy.parent, false)}
      </div>
    `;
  }

  // 現在の要素
  html += `
    <div class="hierarchy-section">
      <div class="hierarchy-title">🎯 選択中の要素</div>
      ${renderElementCard(currentElement, true)}
    </div>
  `;

  // 子要素
  if (hierarchy.children && hierarchy.children.length > 0) {
    html += `
      <div class="hierarchy-section">
        <div class="hierarchy-title">⬇️ 子要素 (${hierarchy.children.length}個)</div>
        <div class="children-grid">
          ${hierarchy.children.map(child => renderElementCard(child, false)).join('')}
        </div>
      </div>
    `;
  }

  // 兄弟要素
  if (hierarchy.siblings && hierarchy.siblings.length > 0) {
    html += `
      <div class="hierarchy-section">
        <div class="hierarchy-title">↔️ 兄弟要素 (${hierarchy.siblings.length}個)</div>
        <div class="children-grid">
          ${hierarchy.siblings.slice(0, 6).map(sibling => renderElementCard(sibling, false)).join('')}
        </div>
        ${hierarchy.siblings.length > 6 ? `<div class="empty-message">...他 ${hierarchy.siblings.length - 6} 個</div>` : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * 要素カードをレンダリング
 * @param {Object} element - 要素情報
 * @param {boolean} isCurrent - 現在の要素かどうか
 * @returns {string} HTML文字列
 */
function renderElementCard(element, isCurrent) {
  const classAttr = isCurrent ? 'element-card current' : 'element-card';
  const idText = element.id ? `<span class="element-id">#${element.id}</span>` : '';
  const classesText = element.classes && element.classes.length > 0
    ? `<span class="element-classes">.${element.classes.join('.')}</span>`
    : '';
  const textPreview = element.textContent
    ? `<div class="element-text">${escapeHtml(element.textContent)}</div>`
    : '';

  return `
    <div class="${classAttr}">
      <div class="element-info">
        <span class="element-tag-small">&lt;${element.tagName}&gt;</span>
        ${idText}
        ${classesText}
      </div>
      ${textPreview}
    </div>
  `;
}

/**
 * Flexbox/Grid レイアウトを表示
 * @param {Object} cssProperties - CSSプロパティ
 */
function displayLayout(cssProperties) {
  const section = document.getElementById('layoutSection');
  const titleElement = document.getElementById('layoutTitle');
  const container = document.getElementById('layoutVisualization');

  const isFlexbox = cssProperties.display === 'flex' || cssProperties.display === 'inline-flex';
  const isGrid = cssProperties.display === 'grid' || cssProperties.display === 'inline-grid';

  if (!isFlexbox && !isGrid) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  if (isFlexbox) {
    titleElement.textContent = '📐 Flexbox レイアウト';
    displayFlexboxLayout(cssProperties, container);
  } else if (isGrid) {
    titleElement.textContent = '📊 Grid レイアウト';
    displayGridLayout(cssProperties, container);
  }
}

/**
 * Flexbox レイアウト詳細を表示
 * @param {Object} cssProperties - CSSプロパティ
 * @param {HTMLElement} container - コンテナ要素
 */
function displayFlexboxLayout(cssProperties, container) {
  const flexProperties = [
    { name: 'flex-direction', value: cssProperties.flexDirection },
    { name: 'flex-wrap', value: cssProperties.flexWrap },
    { name: 'justify-content', value: cssProperties.justifyContent },
    { name: 'align-items', value: cssProperties.alignItems },
    { name: 'align-content', value: cssProperties.alignContent },
    { name: 'flex', value: cssProperties.flex },
    { name: 'flex-grow', value: cssProperties.flexGrow },
    { name: 'flex-shrink', value: cssProperties.flexShrink },
    { name: 'flex-basis', value: cssProperties.flexBasis },
    { name: 'order', value: cssProperties.order }
  ];

  const html = `
    <div class="layout-info">
      ${flexProperties.map(prop => `
        <div class="layout-property">
          <div class="layout-property-name">${prop.name}</div>
          <div class="layout-property-value">${prop.value}</div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Grid レイアウト詳細を表示
 * @param {Object} cssProperties - CSSプロパティ
 * @param {HTMLElement} container - コンテナ要素
 */
function displayGridLayout(cssProperties, container) {
  const gridProperties = [
    { name: 'grid-template-columns', value: cssProperties.gridTemplateColumns },
    { name: 'grid-template-rows', value: cssProperties.gridTemplateRows },
    { name: 'grid-gap', value: cssProperties.gridGap },
    { name: 'grid-column', value: cssProperties.gridColumn },
    { name: 'grid-row', value: cssProperties.gridRow }
  ];

  const html = `
    <div class="layout-info">
      ${gridProperties.map(prop => `
        <div class="layout-property">
          <div class="layout-property-name">${prop.name}</div>
          <div class="layout-property-value">${prop.value}</div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * CSS プロパティをカテゴリ別に表示
 * @param {Object} cssProperties - CSSプロパティ
 */
function displayCSSProperties(cssProperties) {
  const container = document.getElementById('cssProperties');

  // カテゴリ定義
  const categories = [
    {
      name: 'レイアウト',
      className: 'layout',
      properties: {
        display: cssProperties.display,
        position: cssProperties.position,
        float: cssProperties.float,
        clear: cssProperties.clear,
        'z-index': cssProperties.zIndex,
        overflow: cssProperties.overflow,
        'overflow-x': cssProperties.overflowX,
        'overflow-y': cssProperties.overflowY
      }
    },
    {
      name: 'サイズ',
      className: 'sizing',
      properties: {
        width: cssProperties.width,
        height: cssProperties.height,
        'min-width': cssProperties.minWidth,
        'min-height': cssProperties.minHeight,
        'max-width': cssProperties.maxWidth,
        'max-height': cssProperties.maxHeight,
        'box-sizing': cssProperties.boxSizing
      }
    },
    {
      name: '配置',
      className: 'layout',
      properties: {
        top: cssProperties.top,
        right: cssProperties.right,
        bottom: cssProperties.bottom,
        left: cssProperties.left
      }
    },
    {
      name: 'テキスト',
      className: 'text',
      properties: {
        color: cssProperties.color,
        'font-size': cssProperties.fontSize,
        'font-family': cssProperties.fontFamily,
        'font-weight': cssProperties.fontWeight,
        'font-style': cssProperties.fontStyle,
        'line-height': cssProperties.lineHeight,
        'text-align': cssProperties.textAlign,
        'text-decoration': cssProperties.textDecoration,
        'text-transform': cssProperties.textTransform,
        'letter-spacing': cssProperties.letterSpacing,
        'word-spacing': cssProperties.wordSpacing
      }
    },
    {
      name: '背景',
      className: 'background',
      properties: {
        'background-color': cssProperties.backgroundColor,
        'background-image': cssProperties.backgroundImage,
        'background-size': cssProperties.backgroundSize,
        'background-position': cssProperties.backgroundPosition,
        'background-repeat': cssProperties.backgroundRepeat
      }
    },
    {
      name: 'ボーダー',
      className: 'border',
      properties: {
        'border-style': cssProperties.borderStyle,
        'border-color': cssProperties.borderColor,
        'border-radius': cssProperties.borderRadius,
        'border-top-left-radius': cssProperties.borderTopLeftRadius,
        'border-top-right-radius': cssProperties.borderTopRightRadius,
        'border-bottom-left-radius': cssProperties.borderBottomLeftRadius,
        'border-bottom-right-radius': cssProperties.borderBottomRightRadius
      }
    },
    {
      name: 'エフェクト',
      className: 'effects',
      properties: {
        opacity: cssProperties.opacity,
        'box-shadow': cssProperties.boxShadow,
        'text-shadow': cssProperties.textShadow,
        transform: cssProperties.transform,
        transition: cssProperties.transition,
        animation: cssProperties.animation,
        filter: cssProperties.filter
      }
    },
    {
      name: 'その他',
      className: 'layout',
      properties: {
        cursor: cssProperties.cursor,
        'pointer-events': cssProperties.pointerEvents,
        visibility: cssProperties.visibility
      }
    }
  ];

  const html = categories.map(category => {
    // 有効なプロパティのみフィルタリング
    const validProperties = Object.entries(category.properties)
      .filter(([_, value]) => value && value !== 'none' && value !== 'normal' && value !== 'auto');

    if (validProperties.length === 0) return '';

    return `
      <div class="property-category ${category.className}">
        <div class="category-title">${category.name}</div>
        ${validProperties.map(([name, value]) => `
          <div class="property-row">
            <span class="property-name">${name}</span>
            <span class="property-value">${truncateValue(value)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }).filter(html => html !== '').join('');

  container.innerHTML = html;
}

/**
 * 値を切り詰める（長すぎる値の省略）
 * @param {string} value - 値
 * @returns {string} 切り詰められた値
 */
function truncateValue(value) {
  const maxLength = 50;
  if (value.length > maxLength) {
    return value.substring(0, maxLength) + '...';
  }
  return value;
}

/**
 * HTMLエスケープ
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * すべての情報をテキストでコピー
 * @param {Object} elementInfo - 要素情報
 * @returns {string} コピー用テキスト
 */
function getInfoText(elementInfo) {
  let text = '='.repeat(60) + '\n';
  text += 'HTML・CSS 図解\n';
  text += '='.repeat(60) + '\n\n';

  text += `要素: <${elementInfo.htmlInfo.tagName}>\n`;
  text += `セレクタ: ${elementInfo.selectorPath}\n\n`;

  text += '--- ボックスモデル ---\n';
  text += `Content: ${Math.round(elementInfo.boxModel.width)}px × ${Math.round(elementInfo.boxModel.height)}px\n`;
  text += `Padding: ${elementInfo.boxModel.padding.top}px ${elementInfo.boxModel.padding.right}px ${elementInfo.boxModel.padding.bottom}px ${elementInfo.boxModel.padding.left}px\n`;
  text += `Border: ${elementInfo.boxModel.border.top}px ${elementInfo.boxModel.border.right}px ${elementInfo.boxModel.border.bottom}px ${elementInfo.boxModel.border.left}px\n`;
  text += `Margin: ${elementInfo.boxModel.margin.top}px ${elementInfo.boxModel.margin.right}px ${elementInfo.boxModel.margin.bottom}px ${elementInfo.boxModel.margin.left}px\n\n`;

  if (elementInfo.textContent) {
    text += '--- テキスト内容 ---\n';
    text += elementInfo.textContent + '\n\n';
  }

  text += '--- 主要CSSプロパティ ---\n';
  text += `display: ${elementInfo.cssProperties.display}\n`;
  text += `position: ${elementInfo.cssProperties.position}\n`;
  text += `width: ${elementInfo.cssProperties.width}\n`;
  text += `height: ${elementInfo.cssProperties.height}\n`;
  text += `color: ${elementInfo.cssProperties.color}\n`;
  text += `background-color: ${elementInfo.cssProperties.backgroundColor}\n`;

  return text;
}

/**
 * ページ読み込み時の初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
  // chrome.storage.localから最新の要素情報を取得
  chrome.storage.local.get(['latestElementInfo'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('ストレージ読み込みエラー:', chrome.runtime.lastError);
      document.getElementById('loading').innerHTML =
        '<p>エラー: 情報の読み込みに失敗しました</p>';
      return;
    }

    if (!result.latestElementInfo) {
      document.getElementById('loading').innerHTML =
        '<p>エラー: 要素情報が見つかりません</p>';
      return;
    }

    // 要素情報を表示
    displayElementInfo(result.latestElementInfo);

    // コピーボタンのイベントリスナー
    document.getElementById('copyBtn').addEventListener('click', () => {
      const text = getInfoText(result.latestElementInfo);
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ コピーしました！';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('コピー失敗:', err);
        alert('コピーに失敗しました');
      });
    });
  });
});
