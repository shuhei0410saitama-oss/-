/**
 * popup.js
 * 役割: 拡張機能のポップアップUIを制御する
 * - 要素選択モードの開始/キャンセルを処理
 * - content scriptに選択モード開始のメッセージを送信
 * - 要素が選択されたら図解ページを開く
 */

// DOM要素の取得
const selectBtn = document.getElementById('selectBtn');
const cancelBtn = document.getElementById('cancelBtn');
const statusDiv = document.getElementById('status');

/**
 * ステータスメッセージを表示する関数
 * @param {string} message - 表示するメッセージ
 * @param {string} type - メッセージタイプ ('loading', 'error', 'success', 'active-mode')
 */
function showStatus(message, type = '') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

/**
 * UIを選択モードに切り替える
 */
function activateSelectionMode() {
  selectBtn.style.display = 'none';
  cancelBtn.style.display = 'block';
  showStatus('ページ上の要素をクリックしてください', 'active-mode');
}

/**
 * UIを通常モードに戻す
 */
function deactivateSelectionMode() {
  selectBtn.style.display = 'block';
  cancelBtn.style.display = 'none';
  showStatus('');
}

/**
 * 「要素を選択」ボタンのクリックイベント
 */
selectBtn.addEventListener('click', async () => {
  try {
    // アクティブなタブを取得
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      throw new Error('アクティブなタブが見つかりません');
    }

    // content scriptに選択モード開始のメッセージを送信
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'startSelection'
      });

      // UIを選択モードに切り替え
      activateSelectionMode();

    } catch (msgError) {
      // content scriptが読み込まれていない場合
      if (msgError.message.includes('Could not establish connection') ||
          msgError.message.includes('Receiving end does not exist')) {
        showStatus('ページを再読み込み（F5）してください', 'error');
      } else {
        throw msgError;
      }
    }

  } catch (error) {
    console.error('エラー:', error);
    showStatus('エラー: ' + error.message, 'error');
  }
});

/**
 * 「選択をキャンセル」ボタンのクリックイベント
 */
cancelBtn.addEventListener('click', async () => {
  try {
    // アクティブなタブを取得
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      throw new Error('アクティブなタブが見つかりません');
    }

    // content scriptに選択キャンセルのメッセージを送信
    await chrome.tabs.sendMessage(tab.id, {
      action: 'cancelSelection'
    });

    // UIを通常モードに戻す
    deactivateSelectionMode();

  } catch (error) {
    console.error('エラー:', error);
    showStatus('エラー: ' + error.message, 'error');
  }
});

/**
 * background scriptからのメッセージを受信
 * 要素が選択されたときに通知を受け取る
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'elementSelected') {
    // 要素が選択されたら、図解ページを開く
    showStatus('図解を生成中...', 'loading');

    chrome.tabs.create({
      url: chrome.runtime.getURL('result.html')
    });

    // ポップアップを閉じる
    setTimeout(() => {
      window.close();
    }, 500);

    sendResponse({ success: true });
    return true;
  }
});
