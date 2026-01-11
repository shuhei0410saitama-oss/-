/**
 * result.js
 * 役割: 選択された要素の情報を視覚的に図解表示
 * - chrome.storage.localから要素情報を読み込む
 * - CSSボックスモデル図を描画
 * - CSS プロパティ、HTML構造、階層を表示
 */

/**
 * ボックスモデル図を生成
 * @param {Object} boxModel - ボックスモデル情報
 * @returns {string} HTML文字列
 */
function renderBoxModel(boxModel) {
  const { margin, border, padding, width, height } = boxModel;

  // 内部コンテンツのサイズ計算
  const contentWidth = width - (padding.left + padding.right + border.left + border.right);
  const contentHeight = height - (padding.top + padding.bottom + border.top + border.bottom);

  return `
    <div class="box-model">
      <!-- Margin Layer -->
      <div class="box-layer margin-layer">
        <div class="box-label">margin</div>
        <div class="box-values">
          ${margin.top.toFixed(1)}px | ${margin.right.toFixed(1)}px |
          ${margin.bottom.toFixed(1)}px | ${margin.left.toFixed(1)}px
        </div>

        <!-- Border Layer -->
        <div class="box-layer border-layer">
          <div class="box-label">border</div>
          <div class="box-values">
            ${border.top.toFixed(1)}px | ${border.right.toFixed(1)}px |
            ${border.bottom.toFixed(1)}px | ${border.left.toFixed(1)}px
          </div>

          <!-- Padding Layer -->
          <div class="box-layer padding-layer">
            <div class="box-label">padding</div>
            <div class="box-values">
              ${padding.top.toFixed(1)}px | ${padding.right.toFixed(1)}px |
              ${padding.bottom.toFixed(1)}px | ${padding.left.toFixed(1)}px
            </div>

            <!-- Content Layer -->
            <div class="content-layer">
              <div class="box-label">content</div>
              <div class="box-values">
                ${contentWidth.toFixed(1)}px × ${contentHeight.toFixed(1)}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * HTML情報を生成
 * @param {Object} htmlInfo - HTML情報
 * @returns {string} HTML文字列
 */
function renderHtmlInfo(htmlInfo) {
  const { tagName, id, classes, attributes } = htmlInfo;

  let html = '<div class="html-info">';

  // タグ名
  html += `<div><span class="tag">&lt;${tagName}&gt;</span></div>`;

  // ID
  if (id) {
    html += `<div style="margin-top: 10px;"><strong>ID:</strong> <span class="value">#${id}</span></div>`;
  }

  // クラス
  if (classes.length > 0) {
    html += `<div style="margin-top: 10px;"><strong>Classes:</strong> <span class="value">.${classes.join(', .')}</span></div>`;
  }

  // その他の属性
  const otherAttrs = attributes.filter(attr => attr.name !== 'id' && attr.name !== 'class');
  if (otherAttrs.length > 0) {
    html += '<div style="margin-top: 10px;"><strong>Attributes:</strong></div>';
    otherAttrs.forEach(attr => {
      html += `<div style="margin-left: 10px;">
        <span class="attr">${attr.name}</span>=<span class="value">"${attr.value}"</span>
      </div>`;
    });
  }

  html += '</div>';
  return html;
}

/**
 * CSSプロパティのテーブル行を生成
 * @param {Object} cssProperties - CSSプロパティ
 */
function renderCssProperties(cssProperties) {
  const tbody = document.getElementById('cssPropsBody');
  tbody.innerHTML = '';

  // 重要なプロパティのみを表示（値が 'none', 'auto', '0px' などのデフォルト値以外）
  for (const [prop, value] of Object.entries(cssProperties)) {
    // デフォルト値をスキップ
    if (value === 'none' || value === 'auto' || value === 'normal' ||
        value === '0px' || value === 'rgba(0, 0, 0, 0)' || value === '') {
      continue;
    }

    const row = document.createElement('tr');

    const propCell = document.createElement('td');
    propCell.className = 'prop-name';
    propCell.textContent = prop;

    const valueCell = document.createElement('td');
    valueCell.className = 'prop-value';
    valueCell.textContent = value;

    row.appendChild(propCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }

  // プロパティが1つもない場合
  if (tbody.children.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 2;
    cell.textContent = '表示する主要なプロパティがありません';
    cell.style.textAlign = 'center';
    cell.style.color = '#999';
    row.appendChild(cell);
    tbody.appendChild(row);
  }
}

/**
 * 階層構造を生成
 * @param {Object} hierarchy - 階層情報
 * @param {Object} htmlInfo - 現在の要素のHTML情報
 */
function renderHierarchy(hierarchy, htmlInfo) {
  const container = document.getElementById('hierarchy');
  let html = '';

  // 親要素
  if (hierarchy.parent) {
    const parent = hierarchy.parent;
    const parentClasses = parent.classes.length > 0 ? '.' + parent.classes.join('.') : '';
    const parentId = parent.id ? `#${parent.id}` : '';
    html += `<div class="hierarchy-item parent">
      <strong>親:</strong> &lt;${parent.tagName}${parentId}${parentClasses}&gt;
    </div>`;
  }

  // 現在の要素
  const currentClasses = htmlInfo.classes.length > 0 ? '.' + htmlInfo.classes.join('.') : '';
  const currentId = htmlInfo.id ? `#${htmlInfo.id}` : '';
  html += `<div class="hierarchy-item current">
    <strong>選択中:</strong> &lt;${htmlInfo.tagName}${currentId}${currentClasses}&gt;
  </div>`;

  // 子要素
  if (hierarchy.children.length > 0) {
    html += '<div style="margin-top: 10px;"><strong>子要素:</strong></div>';
    hierarchy.children.forEach(child => {
      const childClasses = child.classes.length > 0 ? '.' + child.classes.join('.') : '';
      const childId = child.id ? `#${child.id}` : '';
      html += `<div class="hierarchy-item child">
        &lt;${child.tagName}${childId}${childClasses}&gt;
      </div>`;
    });
  } else {
    html += '<div style="margin-top: 10px; color: #999;">子要素なし</div>';
  }

  container.innerHTML = html;
}

/**
 * すべての要素情報を表示
 * @param {Object} elementInfo - 要素情報
 */
function displayElementInfo(elementInfo) {
  // セレクタパス
  document.getElementById('selectorPath').textContent = elementInfo.selectorPath;

  // ボックスモデル図
  document.getElementById('boxModel').innerHTML = renderBoxModel(elementInfo.boxModel);

  // HTML情報
  document.getElementById('htmlInfo').innerHTML = renderHtmlInfo(elementInfo.htmlInfo);

  // CSSプロパティ
  renderCssProperties(elementInfo.cssProperties);

  // 階層構造
  renderHierarchy(elementInfo.hierarchy, elementInfo.htmlInfo);

  // HTMLコード
  const htmlCode = elementInfo.outerHTML
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  document.getElementById('htmlCode').textContent = htmlCode;

  // ローディングを非表示、コンテンツを表示
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';
}

/**
 * CSS情報をテキストで取得（コピー用）
 * @param {Object} elementInfo - 要素情報
 * @returns {string} プレーンテキスト形式のCSS情報
 */
function getElementInfoText(elementInfo) {
  let text = '='.repeat(60) + '\n';
  text += 'CSS図解 - 要素情報\n';
  text += '='.repeat(60) + '\n\n';

  text += `セレクタ: ${elementInfo.selectorPath}\n\n`;

  text += '--- ボックスモデル ---\n';
  const { margin, border, padding, width, height } = elementInfo.boxModel;
  text += `Width: ${width.toFixed(1)}px\n`;
  text += `Height: ${height.toFixed(1)}px\n`;
  text += `Margin: ${margin.top.toFixed(1)}px ${margin.right.toFixed(1)}px ${margin.bottom.toFixed(1)}px ${margin.left.toFixed(1)}px\n`;
  text += `Border: ${border.top.toFixed(1)}px ${border.right.toFixed(1)}px ${border.bottom.toFixed(1)}px ${border.left.toFixed(1)}px\n`;
  text += `Padding: ${padding.top.toFixed(1)}px ${padding.right.toFixed(1)}px ${padding.bottom.toFixed(1)}px ${padding.left.toFixed(1)}px\n\n`;

  text += '--- HTML情報 ---\n';
  text += `Tag: <${elementInfo.htmlInfo.tagName}>\n`;
  if (elementInfo.htmlInfo.id) {
    text += `ID: #${elementInfo.htmlInfo.id}\n`;
  }
  if (elementInfo.htmlInfo.classes.length > 0) {
    text += `Classes: .${elementInfo.htmlInfo.classes.join(', .')}\n`;
  }
  text += '\n';

  text += '--- 主要なCSSプロパティ ---\n';
  for (const [prop, value] of Object.entries(elementInfo.cssProperties)) {
    if (value !== 'none' && value !== 'auto' && value !== 'normal' &&
        value !== '0px' && value !== 'rgba(0, 0, 0, 0)' && value !== '') {
      text += `${prop}: ${value}\n`;
    }
  }

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
        '<p style="color: red;">エラー: 要素情報の読み込みに失敗しました</p>';
      return;
    }

    if (!result.latestElementInfo) {
      document.getElementById('loading').innerHTML =
        '<p style="color: red;">エラー: 要素情報が見つかりません</p>';
      return;
    }

    // 要素情報を表示
    displayElementInfo(result.latestElementInfo);

    // コピーボタンのイベントリスナー
    document.getElementById('copyBtn').addEventListener('click', () => {
      const text = getElementInfoText(result.latestElementInfo);
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
