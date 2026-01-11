/**
 * background.js
 * 役割: バックグラウンドで動作するService Worker
 * - content.jsから送信された要素情報を受信
 * - 要素情報をChromeストレージに保存
 * - popup.jsに通知を送信
 */

/**
 * メッセージリスナー: content.jsからのメッセージを処理
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveElementInfo') {
    try {
      const elementInfo = request.data;

      if (!elementInfo) {
        sendResponse({
          success: false,
          error: '要素情報が不正です'
        });
        return true;
      }

      // Chromeのローカルストレージに保存
      // result.htmlで読み込むため
      chrome.storage.local.set({
        latestElementInfo: elementInfo,
        timestamp: new Date().toISOString()
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('ストレージ保存エラー:', chrome.runtime.lastError);
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message
          });
        } else {
          console.log('要素情報を保存しました:', elementInfo);
          sendResponse({
            success: true
          });
        }
      });

    } catch (error) {
      console.error('background.js エラー:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }

    // 非同期レスポンスのためtrueを返す
    return true;
  }
});

// Service Worker起動時のログ
console.log('CSS図解ツール: background service worker started');
