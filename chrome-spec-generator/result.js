/**
 * result.js
 * 役割: 生成された仕様書を表示するページのスクリプト
 * - chrome.storage.localから仕様書データを読み込む
 * - HTMLに仕様書の内容を動的に挿入
 * - コピー・印刷機能を提供
 */

/**
 * 配列をリスト項目として表示する関数
 * @param {Array} items - 表示する項目の配列
 * @param {HTMLElement} container - 項目を挿入するコンテナ要素
 */
function renderList(items, container) {
  container.innerHTML = '';

  if (!items || items.length === 0) {
    const li = document.createElement('li');
    li.textContent = '（なし）';
    container.appendChild(li);
    return;
  }

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

/**
 * 日時を読みやすい形式にフォーマットする関数
 * @param {string} isoString - ISO形式の日時文字列
 * @returns {string} フォーマットされた日時文字列
 */
function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 仕様書データをHTMLに表示する関数
 * @param {Object} spec - 仕様書データ
 */
function displaySpecification(spec) {
  // メタデータを表示
  document.getElementById('pageTitle').textContent = spec.metadata.pageTitle;
  document.getElementById('pageUrl').textContent = spec.metadata.pageUrl;
  document.getElementById('pageUrl').href = spec.metadata.pageUrl;
  document.getElementById('generatedAt').textContent = formatDateTime(spec.metadata.generatedAt);

  // 注意書きを表示（メタデータのnoteがあれば）
  const noticeDiv = document.getElementById('notice');
  if (spec.metadata.note) {
    noticeDiv.textContent = '⚠️ ' + spec.metadata.note;
  } else {
    noticeDiv.style.display = 'none';
  }

  // 各セクションのデータを表示
  document.getElementById('purpose').textContent = spec.purpose || '（情報なし）';

  renderList(spec.mainFeatures, document.getElementById('mainFeatures'));
  renderList(spec.targetUsers, document.getElementById('targetUsers'));
  renderList(spec.constraints, document.getElementById('constraints'));
  renderList(spec.unknowns, document.getElementById('unknowns'));

  // ローディングを非表示、コンテンツを表示
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';
}

/**
 * 仕様書のテキストを取得する関数（コピー用）
 * @param {Object} spec - 仕様書データ
 * @returns {string} プレーンテキスト形式の仕様書
 */
function getSpecificationText(spec) {
  let text = '━━━━━━━━━━━━━━━━━━━━━━\n';
  text += '生成された仕様書\n';
  text += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

  text += `対象ページ: ${spec.metadata.pageTitle}\n`;
  text += `URL: ${spec.metadata.pageUrl}\n`;
  text += `生成日時: ${formatDateTime(spec.metadata.generatedAt)}\n\n`;

  text += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

  text += '1. このページは何のためのものか\n';
  text += '----------------------------------------\n';
  text += spec.purpose + '\n\n';

  text += '2. 主な機能・内容\n';
  text += '----------------------------------------\n';
  spec.mainFeatures.forEach((item, i) => {
    text += `  ${i + 1}. ${item}\n`;
  });
  text += '\n';

  text += '3. 想定される利用者\n';
  text += '----------------------------------------\n';
  spec.targetUsers.forEach((item, i) => {
    text += `  ${i + 1}. ${item}\n`;
  });
  text += '\n';

  text += '4. 制約・注意点\n';
  text += '----------------------------------------\n';
  if (spec.constraints.length > 0) {
    spec.constraints.forEach((item, i) => {
      text += `  ${i + 1}. ${item}\n`;
    });
  } else {
    text += '  （なし）\n';
  }
  text += '\n';

  text += '5. 不明点・読み取れなかった点\n';
  text += '----------------------------------------\n';
  if (spec.unknowns.length > 0) {
    spec.unknowns.forEach((item, i) => {
      text += `  ${i + 1}. ${item}\n`;
    });
  } else {
    text += '  （なし）\n';
  }

  text += '\n━━━━━━━━━━━━━━━━━━━━━━\n';

  return text;
}

/**
 * ページ読み込み時の初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
  // chrome.storage.localから最新の仕様書データを取得
  chrome.storage.local.get(['latestSpec'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('ストレージ読み込みエラー:', chrome.runtime.lastError);
      document.getElementById('loading').innerHTML =
        '<p style="color: red;">エラー: 仕様書データの読み込みに失敗しました</p>';
      return;
    }

    if (!result.latestSpec) {
      document.getElementById('loading').innerHTML =
        '<p style="color: red;">エラー: 仕様書データが見つかりません</p>';
      return;
    }

    // 仕様書を表示
    displaySpecification(result.latestSpec);

    // コピーボタンのイベントリスナー
    document.getElementById('copyBtn').addEventListener('click', () => {
      const text = getSpecificationText(result.latestSpec);
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

    // 印刷ボタンのイベントリスナー
    document.getElementById('printBtn').addEventListener('click', () => {
      window.print();
    });
  });
});
