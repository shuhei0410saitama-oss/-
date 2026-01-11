/**
 * content.js
 * 役割: Webページに注入され、ページの本文テキストを取得する
 * - popup.jsからのメッセージを受信
 * - ページのタイトル、URL、本文テキストを抽出
 * - 抽出したデータをpopup.jsに返送
 */

/**
 * ページの本文テキストを取得する関数
 * 不要な要素（script、style、nav、footer等）を除外して本文のみを抽出
 * @returns {string} 抽出した本文テキスト
 */
function getPageContent() {
  // 除外する要素のセレクタ
  const excludeSelectors = [
    'script',
    'style',
    'nav',
    'footer',
    'header',
    'aside',
    'iframe',
    'noscript',
    '[role="navigation"]',
    '[role="banner"]',
    '[role="contentinfo"]'
  ];

  // ページ全体のクローンを作成
  const clone = document.body.cloneNode(true);

  // 除外要素を削除
  excludeSelectors.forEach(selector => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  // テキストを取得して整形
  let text = clone.textContent || clone.innerText || '';

  // 余分な空白や改行を削除
  text = text
    .replace(/\s+/g, ' ')  // 連続する空白を1つに
    .replace(/\n+/g, '\n') // 連続する改行を1つに
    .trim();               // 前後の空白を削除

  return text;
}

/**
 * ページのメタ情報を取得する関数
 * @returns {Object} ページのタイトル、URL、説明
 */
function getPageMetadata() {
  const title = document.title || '無題のページ';
  const url = window.location.href;
  const description = document.querySelector('meta[name="description"]')?.content || '';

  return { title, url, description };
}

/**
 * メッセージリスナー: popup.jsからのメッセージを受信
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    try {
      // ページの本文とメタ情報を取得
      const content = getPageContent();
      const metadata = getPageMetadata();

      // データが正常に取得できたか確認
      if (!content || content.length === 0) {
        sendResponse({
          success: false,
          error: 'ページの本文を取得できませんでした'
        });
        return true;
      }

      // 成功レスポンスを返送
      sendResponse({
        success: true,
        data: {
          title: metadata.title,
          url: metadata.url,
          description: metadata.description,
          content: content,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('content.js エラー:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }

    // 非同期レスポンスのためtrueを返す
    return true;
  }
});

// content script読み込み完了のログ（開発時のデバッグ用）
console.log('仕様書ジェネレーター: content script loaded');
