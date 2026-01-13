/**
 * options.js
 * 役割: 設定画面のロジック（Google AI API設定）
 */

// DOM要素を取得
const enableAICheckbox = document.getElementById('enableAI');
const apiKeyGroup = document.getElementById('apiKeyGroup');
const apiKeyInput = document.getElementById('apiKey');
const nanoBananaGroup = document.getElementById('nanoBananaGroup');
const enableNanoBananaCheckbox = document.getElementById('enableNanoBanana');
const saveBtn = document.getElementById('saveBtn');
const testBtn = document.getElementById('testBtn');
const statusDiv = document.getElementById('status');

/**
 * 設定を読み込み
 */
function loadSettings() {
  chrome.storage.sync.get(['enableAI', 'geminiApiKey', 'enableNanoBanana'], (result) => {
    if (result.enableAI) {
      enableAICheckbox.checked = true;
      apiKeyGroup.style.display = 'block';
      nanoBananaGroup.style.display = 'block';
    }

    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }

    if (result.enableNanoBanana) {
      enableNanoBananaCheckbox.checked = true;
    }
  });
}

/**
 * 設定を保存
 */
function saveSettings() {
  const enableAI = enableAICheckbox.checked;
  const apiKey = apiKeyInput.value.trim();
  const enableNanoBanana = enableNanoBananaCheckbox.checked;

  if (enableAI && !apiKey) {
    showStatus('APIキーを入力してください', 'error');
    return;
  }

  chrome.storage.sync.set({
    enableAI: enableAI,
    geminiApiKey: apiKey,
    enableNanoBanana: enableNanoBanana
  }, () => {
    showStatus('設定を保存しました', 'success');
  });
}

/**
 * API接続テスト
 */
async function testAPI() {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showStatus('APIキーを入力してください', 'error');
    return;
  }

  showStatus('接続テスト中...', 'success');
  testBtn.disabled = true;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);

    if (response.ok) {
      showStatus('✅ API接続成功！', 'success');
    } else {
      const errorData = await response.json();
      showStatus('❌ API接続失敗: ' + (errorData.error?.message || 'APIキーが無効です'), 'error');
    }
  } catch (error) {
    showStatus('❌ 接続エラー: ' + error.message, 'error');
  } finally {
    testBtn.disabled = false;
  }
}

/**
 * ステータスメッセージを表示
 */
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = 'status ' + type;

  // 成功メッセージは3秒後に非表示
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}

/**
 * チェックボックスの変更イベント
 */
enableAICheckbox.addEventListener('change', () => {
  if (enableAICheckbox.checked) {
    apiKeyGroup.style.display = 'block';
    nanoBananaGroup.style.display = 'block';
  } else {
    apiKeyGroup.style.display = 'none';
    nanoBananaGroup.style.display = 'none';
  }
});

/**
 * 保存ボタンのクリックイベント
 */
saveBtn.addEventListener('click', saveSettings);

/**
 * テストボタンのクリックイベント
 */
testBtn.addEventListener('click', testAPI);

/**
 * ページ読み込み時に設定を読み込み
 */
document.addEventListener('DOMContentLoaded', loadSettings);
