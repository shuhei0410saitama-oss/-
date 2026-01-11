/**
 * result.js
 * 役割: 選択された要素のコンテンツ情報を図解表示
 * - chrome.storage.localから要素情報を読み込む
 * - 見出し、段落、リスト、キーワードなどを整形して表示
 */

/**
 * コンテンツ情報を表示
 * @param {Object} contentInfo - コンテンツ情報
 */
function displayContentInfo(contentInfo) {
  // タイトル
  document.getElementById('titleBox').textContent = contentInfo.title;

  // 統計情報
  const statsHtml = `
    <div class="stat-item">📊 文字数: ${contentInfo.charCount.toLocaleString()}</div>
    <div class="stat-item">📝 単語数: ${contentInfo.wordCount.toLocaleString()}</div>
    <div class="stat-item">📑 見出し: ${contentInfo.headings.length}</div>
    <div class="stat-item">📄 段落: ${contentInfo.paragraphs.length}</div>
  `;
  document.getElementById('stats').innerHTML = statsHtml;

  // 見出し構造
  renderHeadings(contentInfo.headings);

  // 段落
  renderParagraphs(contentInfo.paragraphs);

  // リスト
  renderLists(contentInfo.lists);

  // キーワード
  renderKeywords(contentInfo.keywords);

  // 画像
  renderImages(contentInfo.images);

  // ローディングを非表示、コンテンツを表示
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';
}

/**
 * 見出し構造を表示
 * @param {Array} headings - 見出しリスト
 */
function renderHeadings(headings) {
  const container = document.getElementById('headingsTree');

  if (headings.length === 0) {
    container.innerHTML = '<div class="empty-message">見出しが見つかりませんでした</div>';
    return;
  }

  let html = '';
  headings.forEach(heading => {
    html += `<div class="heading-item ${heading.level}">
      <strong>${heading.level.toUpperCase()}:</strong> ${heading.text}
    </div>`;
  });

  container.innerHTML = html;
}

/**
 * 段落を表示
 * @param {Array} paragraphs - 段落リスト
 */
function renderParagraphs(paragraphs) {
  const container = document.getElementById('paragraphs');
  const section = document.getElementById('paragraphsSection');

  if (paragraphs.length === 0) {
    section.style.display = 'none';
    return;
  }

  // 最大5段落まで表示
  const displayParagraphs = paragraphs.slice(0, 5);

  let html = '';
  displayParagraphs.forEach(para => {
    html += `<div class="paragraph">
      <span class="paragraph-number">段落${para.index}</span>
      ${para.text}
    </div>`;
  });

  if (paragraphs.length > 5) {
    html += `<div class="empty-message">...他${paragraphs.length - 5}段落</div>`;
  }

  container.innerHTML = html;
}

/**
 * リストを表示
 * @param {Array} lists - リストリスト
 */
function renderLists(lists) {
  const container = document.getElementById('lists');
  const section = document.getElementById('listsSection');

  if (lists.length === 0) {
    section.style.display = 'none';
    return;
  }

  let html = '';
  lists.forEach((list, index) => {
    const tag = list.type === 'ol' ? 'ol' : 'ul';
    html += `<div class="list-container">
      <strong>リスト ${index + 1} (${list.type === 'ol' ? '番号付き' : '箇条書き'})</strong>
      <${tag}>
        ${list.items.map(item => `<li>${item}</li>`).join('')}
      </${tag}>
    </div>`;
  });

  container.innerHTML = html;
}

/**
 * キーワードを表示
 * @param {Array} keywords - キーワードリスト
 */
function renderKeywords(keywords) {
  const container = document.getElementById('keywords');
  const section = document.getElementById('keywordsSection');

  if (keywords.length === 0) {
    section.style.display = 'none';
    return;
  }

  let html = '';
  keywords.forEach(keyword => {
    html += `<span class="keyword">${keyword}</span>`;
  });

  container.innerHTML = html;
}

/**
 * 画像を表示
 * @param {Array} images - 画像リスト
 */
function renderImages(images) {
  const container = document.getElementById('images');
  const section = document.getElementById('imagesSection');

  if (images.length === 0) {
    section.style.display = 'none';
    return;
  }

  let html = '';
  images.forEach((img, index) => {
    html += `<div class="image-item">
      ${img.src ? `<img src="${img.src}" alt="${img.alt || '画像'}">` : ''}
      <div><strong>画像 ${index + 1}</strong></div>
      ${img.alt ? `<div>Alt: ${img.alt}</div>` : ''}
      ${img.title ? `<div>Title: ${img.title}</div>` : ''}
    </div>`;
  });

  container.innerHTML = html;
}

/**
 * コンテンツをテキストで取得（コピー用）
 * @param {Object} contentInfo - コンテンツ情報
 * @returns {string} プレーンテキスト
 */
function getContentText(contentInfo) {
  let text = '='.repeat(60) + '\n';
  text += 'コンテンツ図解\n';
  text += '='.repeat(60) + '\n\n';

  text += `タイトル: ${contentInfo.title}\n\n`;

  text += `文字数: ${contentInfo.charCount.toLocaleString()}\n`;
  text += `単語数: ${contentInfo.wordCount.toLocaleString()}\n\n`;

  if (contentInfo.headings.length > 0) {
    text += '--- 見出し構造 ---\n';
    contentInfo.headings.forEach(heading => {
      const indent = '  '.repeat(parseInt(heading.level.charAt(1)) - 1);
      text += `${indent}${heading.level.toUpperCase()}: ${heading.text}\n`;
    });
    text += '\n';
  }

  if (contentInfo.paragraphs.length > 0) {
    text += '--- 主な段落 ---\n';
    contentInfo.paragraphs.slice(0, 5).forEach(para => {
      text += `[段落${para.index}] ${para.text}\n\n`;
    });
  }

  if (contentInfo.lists.length > 0) {
    text += '--- リスト項目 ---\n';
    contentInfo.lists.forEach((list, index) => {
      text += `リスト ${index + 1}:\n`;
      list.items.forEach((item, i) => {
        text += `  ${list.type === 'ol' ? (i + 1) + '.' : '•'} ${item}\n`;
      });
      text += '\n';
    });
  }

  if (contentInfo.keywords.length > 0) {
    text += '--- キーワード ---\n';
    text += contentInfo.keywords.join(', ') + '\n\n';
  }

  return text;
}

/**
 * ページ読み込み時の初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
  // chrome.storage.localから最新のコンテンツ情報を取得
  chrome.storage.local.get(['latestElementInfo'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('ストレージ読み込みエラー:', chrome.runtime.lastError);
      document.getElementById('loading').innerHTML =
        '<p style="color: red;">エラー: コンテンツ情報の読み込みに失敗しました</p>';
      return;
    }

    if (!result.latestElementInfo) {
      document.getElementById('loading').innerHTML =
        '<p style="color: red;">エラー: コンテンツ情報が見つかりません</p>';
      return;
    }

    // コンテンツ情報を表示
    displayContentInfo(result.latestElementInfo);

    // コピーボタンのイベントリスナー
    document.getElementById('copyBtn').addEventListener('click', () => {
      const text = getContentText(result.latestElementInfo);
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
