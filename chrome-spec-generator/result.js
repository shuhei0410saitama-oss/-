/**
 * result.js
 * 役割: 抽出したコンテンツ情報を視覚的に図解表示
 */

/**
 * コンテンツ情報を表示
 * @param {Object} contentInfo - コンテンツ情報
 */
async function displayContentInfo(contentInfo) {
  console.log('Content Info:', contentInfo);

  // ローディングメッセージを更新
  document.getElementById('loading').querySelector('p').textContent = '図解を生成しています...';

  // Google AI APIが有効かチェック
  const settings = await new Promise(resolve => {
    chrome.storage.sync.get(['enableAI', 'geminiApiKey'], resolve);
  });

  if (settings.enableAI && settings.geminiApiKey) {
    // AI要約を試みる
    document.getElementById('loading').querySelector('p').textContent = 'AIが内容を要約しています...';
    try {
      await generateAISummary(contentInfo, settings.geminiApiKey);
      console.log('AI要約成功:', contentInfo.cards);
    } catch (error) {
      console.error('AI要約失敗:', error);
      // エラーの場合は通常の図解を表示
      document.getElementById('loading').querySelector('p').textContent = '通常の図解を表示しています...';
    }
  }

  // ページタイトル
  displayPageTitle(contentInfo.pageTitle);

  // カード（主要ポイント）
  displayCards(contentInfo.cards);

  // 見出し構造
  displayHeadings(contentInfo.headings);

  // セクション
  displaySections(contentInfo.sections);

  // 段落
  displayParagraphs(contentInfo.paragraphs);

  // リスト
  displayLists(contentInfo.lists);

  // キーワード
  displayKeywords(contentInfo.keywords);

  // 画像
  displayImages(contentInfo.images);

  // テーブル
  displayTables(contentInfo.tables);

  // ローディングを非表示、コンテンツを表示
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  // デバッグ情報をコンソールに出力
  console.log('表示完了:', {
    cards: contentInfo.cards?.length,
    headings: contentInfo.headings?.length,
    paragraphs: contentInfo.paragraphs?.length,
    sections: contentInfo.sections?.length
  });
}

/**
 * ページタイトルを表示
 */
function displayPageTitle(pageTitle) {
  if (pageTitle) {
    document.getElementById('pageTitle').textContent = pageTitle;
  }
}

/**
 * カード（主要ポイント）を表示
 */
function displayCards(cards) {
  const section = document.getElementById('cardsSection');
  const container = document.getElementById('cardsGrid');

  if (!cards || cards.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = cards.map(card => {
    // highlightsがある場合は大きく表示
    const highlightHTML = card.highlights && card.highlights.length > 0
      ? card.highlights.map(h => `<div class="card-highlight">${escapeHtml(h.value)}</div>`).join('')
      : '';

    // テキストは最初の50文字まで（簡潔に）
    const shortText = card.text.length > 50 ? card.text.substring(0, 50) + '...' : card.text;

    return `
      <div class="card">
        ${card.heading ? `<div class="card-label">${escapeHtml(card.heading)}</div>` : ''}
        ${highlightHTML}
        ${!highlightHTML && card.heading ? `<div class="card-heading">${escapeHtml(card.heading)}</div>` : ''}
        <div class="card-text">${escapeHtml(shortText)}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * 見出し構造を表示
 */
function displayHeadings(headings) {
  const section = document.getElementById('headingsSection');
  const container = document.getElementById('headingsTree');

  if (!headings || headings.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  // 最大10個まで表示（簡潔に）
  const html = headings.slice(0, 10).map(heading => `
    <div class="heading-item level-${heading.level}">
      ${escapeHtml(heading.text)}
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * セクションを表示
 */
function displaySections(sections) {
  const section = document.getElementById('sectionsSection');
  const container = document.getElementById('sectionsContainer');

  if (!sections || sections.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = sections.map(sec => `
    <div class="section-card">
      ${sec.heading ? `<div class="section-card-heading">${escapeHtml(sec.heading)}</div>` : ''}
      <div class="section-card-text">${escapeHtml(sec.text)}</div>
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * 段落を表示
 */
function displayParagraphs(paragraphs) {
  const section = document.getElementById('paragraphsSection');
  const container = document.getElementById('paragraphsContainer');

  if (!paragraphs || paragraphs.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = paragraphs.slice(0, 5).map((para, index) => {
    // 最初の1-2文だけを抽出（簡潔に）
    const sentences = para.text.match(/[^。！？\.\!\?]+[。！？\.\!\?]/g) || [para.text];
    const shortText = sentences.slice(0, 2).join('');

    return `
      <div class="paragraph">
        <span class="paragraph-number">${index + 1}</span>
        ${escapeHtml(shortText)}
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * リストを表示
 */
function displayLists(lists) {
  const section = document.getElementById('listsSection');
  const container = document.getElementById('listsContainer');

  if (!lists || lists.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = lists.map((list, index) => {
    const tag = list.type === 'ol' ? 'ol' : 'ul';
    const items = list.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');

    return `
      <div class="list-box">
        <${tag}>
          ${items}
        </${tag}>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * キーワードを表示
 */
function displayKeywords(keywords) {
  const section = document.getElementById('keywordsSection');
  const container = document.getElementById('keywordsGrid');

  if (!keywords || keywords.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = keywords.map(kw => `
    <div class="keyword">
      ${escapeHtml(kw.word)}
      <span class="keyword-count">${kw.count}</span>
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * 画像を表示
 */
function displayImages(images) {
  const section = document.getElementById('imagesSection');
  const container = document.getElementById('imagesGrid');

  if (!images || images.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = images.map(img => `
    <div class="image-card">
      <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" loading="lazy">
      ${img.alt ? `<div class="image-alt">${escapeHtml(img.alt)}</div>` : ''}
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * テーブルを表示
 */
function displayTables(tables) {
  const section = document.getElementById('tablesSection');
  const container = document.getElementById('tablesContainer');

  if (!tables || tables.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const html = tables.map((table, index) => {
    let tableHtml = `<div class="table-container"><table class="data-table">`;

    // ヘッダー行
    if (table.headers && table.headers.length > 0) {
      tableHtml += '<thead><tr>';
      table.headers.forEach(header => {
        tableHtml += `<th>${escapeHtml(header)}</th>`;
      });
      tableHtml += '</tr></thead>';
    }

    // データ行
    if (table.rows && table.rows.length > 0) {
      tableHtml += '<tbody>';
      table.rows.forEach(row => {
        tableHtml += '<tr>';
        row.forEach(cell => {
          tableHtml += `<td>${escapeHtml(cell)}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody>';
    }

    tableHtml += '</table></div>';
    return tableHtml;
  }).join('');

  container.innerHTML = html;
}

/**
 * HTMLエスケープ
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * コンテンツ情報をテキストでコピー
 * @param {Object} contentInfo - コンテンツ情報
 * @returns {string} コピー用テキスト
 */
function getContentText(contentInfo) {
  let text = '='.repeat(60) + '\n';
  text += 'コンテンツ図解\n';
  text += '='.repeat(60) + '\n\n';

  if (contentInfo.pageTitle) {
    text += `ページタイトル: ${contentInfo.pageTitle}\n\n`;
  }

  // 見出し
  if (contentInfo.headings && contentInfo.headings.length > 0) {
    text += '--- 見出し構造 ---\n';
    contentInfo.headings.forEach(heading => {
      const indent = '  '.repeat(heading.level - 1);
      text += `${indent}${heading.text}\n`;
    });
    text += '\n';
  }

  // カード
  if (contentInfo.cards && contentInfo.cards.length > 0) {
    text += '--- 主要ポイント ---\n';
    contentInfo.cards.forEach((card, index) => {
      text += `[${index + 1}] ${card.heading || ''}\n`;
      text += `${card.text}\n\n`;
    });
  }

  // 段落
  if (contentInfo.paragraphs && contentInfo.paragraphs.length > 0) {
    text += '--- 段落 ---\n';
    contentInfo.paragraphs.slice(0, 5).forEach((para, index) => {
      text += `[${index + 1}] ${para.text}\n\n`;
    });
  }

  // キーワード
  if (contentInfo.keywords && contentInfo.keywords.length > 0) {
    text += '--- 重要キーワード ---\n';
    text += contentInfo.keywords.map(kw => `${kw.word} (${kw.count}回)`).join(', ');
    text += '\n\n';
  }

  return text;
}

/**
 * Google AI (Gemini) APIを使ってコンテンツを要約
 * @param {Object} contentInfo - コンテンツ情報
 * @param {string} apiKey - Google AI APIキー
 */
async function generateAISummary(contentInfo, apiKey) {
  // コンテンツをテキストに変換
  let contentText = `ページタイトル: ${contentInfo.pageTitle}\n\n`;

  if (contentInfo.headings && contentInfo.headings.length > 0) {
    contentText += '見出し:\n';
    contentInfo.headings.slice(0, 10).forEach(h => {
      const indent = '  '.repeat(h.level - 1);
      contentText += `${indent}- ${h.text}\n`;
    });
    contentText += '\n';
  }

  if (contentInfo.paragraphs && contentInfo.paragraphs.length > 0) {
    contentText += '本文:\n';
    contentInfo.paragraphs.slice(0, 5).forEach(p => {
      contentText += `${p.text}\n\n`;
    });
  }

  // Gemini APIにリクエスト
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `以下のWebページの内容を分析し、重要なポイントを3つのカード形式で簡潔にまとめてください。
各カードは「見出し」と「説明（50文字以内）」で構成してください。
数値や期間などの重要情報があれば必ず含めてください。

コンテンツ:
${contentText}

出力形式（JSONで返してください）:
{
  "cards": [
    {"heading": "見出し1", "text": "説明1", "highlight": "重要な数値や情報"},
    {"heading": "見出し2", "text": "説明2", "highlight": "重要な数値や情報"},
    {"heading": "見出し3", "text": "説明3", "highlight": "重要な数値や情報"}
  ]
}`;

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    // JSONを抽出（マークダウンコードブロックを除去）
    const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiSummary = JSON.parse(jsonMatch[1] || jsonMatch[0]);

      // AI要約されたカードを元のカードに追加/上書き
      if (aiSummary.cards && aiSummary.cards.length > 0) {
        contentInfo.cards = aiSummary.cards.map(card => ({
          heading: card.heading,
          text: card.text,
          highlights: card.highlight ? [{ type: 'keyword', value: card.highlight }] : []
        }));
      }
    }
  } catch (error) {
    console.error('AI要約エラー:', error);
    throw error;
  }
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
        '<p>エラー: 情報の読み込みに失敗しました</p>';
      return;
    }

    if (!result.latestElementInfo) {
      document.getElementById('loading').innerHTML =
        '<p>エラー: コンテンツ情報が見つかりません</p>';
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
