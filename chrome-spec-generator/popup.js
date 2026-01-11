/**
 * popup.js
 * 役割: 拡張機能のポップアップUIを制御する
 * - ボタンクリックイベントを処理
 * - content scriptにメッセージを送信してページ内容を取得
 * - 取得したコンテンツを処理して結果ページを開く
 */

// DOM要素の取得
const generateBtn = document.getElementById('generateBtn');
const statusDiv = document.getElementById('status');

/**
 * ステータスメッセージを表示する関数
 * @param {string} message - 表示するメッセージ
 * @param {string} type - メッセージタイプ ('loading', 'error', 'success')
 */
function showStatus(message, type = '') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

/**
 * 「仕様書を生成」ボタンのクリックイベント
 */
generateBtn.addEventListener('click', async () => {
  try {
    // ボタンを無効化
    generateBtn.disabled = true;
    showStatus('ページを解析中...', 'loading');

    // アクティブなタブを取得
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      throw new Error('アクティブなタブが見つかりません');
    }

    // content scriptにメッセージを送信してページ内容を取得
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'getPageContent'
    });

    if (!response || !response.success) {
      throw new Error(response?.error || 'ページ内容の取得に失敗しました');
    }

    showStatus('仕様書を生成中...', 'loading');

    // 取得したコンテンツをbackground scriptに送信して処理
    const result = await chrome.runtime.sendMessage({
      action: 'generateSpec',
      data: response.data
    });

    if (!result || !result.success) {
      throw new Error(result?.error || '仕様書の生成に失敗しました');
    }

    showStatus('完了しました！', 'success');

    // 結果を表示する新しいタブを開く
    chrome.tabs.create({
      url: chrome.runtime.getURL('result.html')
    });

    // ポップアップを閉じる
    setTimeout(() => {
      window.close();
    }, 500);

  } catch (error) {
    console.error('エラー:', error);
    showStatus('エラー: ' + error.message, 'error');
    generateBtn.disabled = false;
  }
});
