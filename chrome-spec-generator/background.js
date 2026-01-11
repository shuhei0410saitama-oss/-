/**
 * background.js
 * 役割: バックグラウンドで動作するService Worker
 * - popup.jsからのメッセージを受信
 * - ページコンテンツから仕様書を生成（現在はダミー処理）
 * - 生成した仕様書をchromeストレージに保存
 */

/**
 * 仕様書を生成するダミー関数
 * 将来的にはAI APIを呼び出して実際の要約を行う
 * @param {Object} pageData - ページの情報（title, url, content等）
 * @returns {Object} 生成された仕様書データ
 */
function generateSpecification(pageData) {
  // ※ 現在はダミー処理。後でAI APIに接続する予定
  // 例: OpenAI API、Claude API、Gemini API等

  const { title, url, content, description } = pageData;

  // コンテンツの長さから推測した情報（ダミー）
  const contentLength = content.length;
  const wordCount = content.split(/\s+/).length;

  // 仕様書フォーマットに沿ったダミーデータを生成
  const specification = {
    // 1. このページは何のためのものか
    purpose: `${title}に関する情報を提供するページです。` +
             (description ? `\n${description}` : ''),

    // 2. 主な機能・内容
    mainFeatures: [
      '本ページの主要コンテンツ（約' + wordCount + '語）',
      'テキスト情報の提供',
      'ユーザー向けの情報表示',
      '※詳細は実際のAI解析後に置き換え予定'
    ],

    // 3. 想定される利用者
    targetUsers: [
      '一般的なWebユーザー',
      '情報を探している訪問者',
      '※AI解析により具体化予定'
    ],

    // 4. 制約・注意点
    constraints: [
      'ページの文字数: 約' + contentLength + '文字',
      '動的コンテンツは取得時点の内容のみ',
      '※実際の制約はAI解析により判定予定'
    ],

    // 5. 不明点・読み取れなかった点
    unknowns: [
      '詳細な機能説明（AI解析が必要）',
      'ページの具体的な目的（AI解析が必要）',
      'ターゲットユーザーの詳細（AI解析が必要）',
      '※このセクションは実際のAI接続後に自動生成されます'
    ],

    // メタ情報
    metadata: {
      pageTitle: title,
      pageUrl: url,
      generatedAt: new Date().toISOString(),
      contentLength: contentLength,
      wordCount: wordCount,
      note: 'これはダミー生成です。実際にはAI APIを使用して要約を行います。'
    }
  };

  return specification;
}

/**
 * メッセージリスナー: popup.jsからのメッセージを処理
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateSpec') {
    try {
      const pageData = request.data;

      if (!pageData || !pageData.content) {
        sendResponse({
          success: false,
          error: 'ページデータが不正です'
        });
        return true;
      }

      // 仕様書を生成（現在はダミー処理）
      const specification = generateSpecification(pageData);

      // Chromeのローカルストレージに保存
      // result.htmlで読み込むため
      chrome.storage.local.set({
        latestSpec: specification
      }, () => {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message
          });
        } else {
          sendResponse({
            success: true,
            specification: specification
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
console.log('仕様書ジェネレーター: background service worker started');
