# 📋 仕様書ジェネレーター Chrome拡張機能

現在表示中のWebページから仕様書のたたき台を自動生成するChrome拡張機能です。

## 🎯 概要

この拡張機能は、Webページの内容を読み取り、以下の構成で仕様書の下書きを自動生成します。

### 生成される仕様書の構成

1. このページは何のためのものか（1〜2文）
2. 主な機能・内容（3〜5点まで）
3. 想定される利用者
4. 制約・注意点（あれば）
5. 不明点・読み取れなかった点

## 📁 フォルダ構成

```
chrome-spec-generator/
├── manifest.json           # Chrome拡張機能のマニフェストファイル（Manifest V3）
├── popup.html              # 拡張機能アイコンクリック時のポップアップUI
├── popup.js                # ポップアップのロジック（ボタンクリック処理等）
├── content.js              # Webページに注入されるスクリプト（本文抽出）
├── background.js           # バックグラウンドService Worker（仕様書生成処理）
├── result.html             # 生成された仕様書を表示するページ
├── result.js               # 結果表示ページのロジック
├── icons/                  # 拡張機能のアイコン画像
│   ├── icon16.png          # 16x16ピクセルアイコン
│   ├── icon48.png          # 48x48ピクセルアイコン
│   ├── icon128.png         # 128x128ピクセルアイコン
│   └── icon.svg            # SVGソース（開発用）
└── README.md               # このファイル
```

## 🔧 各ファイルの役割

### manifest.json
- Chrome拡張機能の設定ファイル
- Manifest V3に準拠
- 必要な権限（activeTab, scripting）を定義

### popup.html / popup.js
- 拡張機能アイコンをクリックした際に表示されるUI
- 「仕様書を生成」ボタンを配置
- content.jsとbackground.jsへのメッセージ送信を担当

### content.js
- 各Webページに注入されるスクリプト
- ページのタイトル、URL、本文テキストを抽出
- 不要な要素（nav, footer, script, style等）を除外して本文のみ取得

### background.js
- バックグラウンドで動作するService Worker
- ページコンテンツから仕様書を生成
- **現在はダミー処理**（後でAI API接続予定）
- 生成結果をChrome Storage APIに保存

### result.html / result.js
- 新しいタブで開かれる結果表示ページ
- 生成された仕様書を整形して表示
- コピー・印刷機能を提供

### icons/
- Chrome拡張機能のアイコン画像（PNG形式）
- 3種類のサイズ（16px, 48px, 128px）を用意

## 🚀 使用方法

### 1. 拡張機能の読み込み（Chromeでの有効化）

1. Chromeブラウザを開きます
2. アドレスバーに `chrome://extensions/` と入力してEnterを押します
3. 右上の「デベロッパーモード」をONにします
4. 左上の「パッケージ化されていない拡張機能を読み込む」をクリックします
5. `chrome-spec-generator` フォルダを選択します
6. 拡張機能が読み込まれ、アイコンがツールバーに表示されます

### 2. 仕様書の生成

1. 仕様書を作成したいWebページを開きます
2. ブラウザのツールバーにある拡張機能のアイコン（緑の書類アイコン）をクリックします
3. ポップアップが表示されたら「仕様書を生成」ボタンをクリックします
4. 新しいタブが開き、生成された仕様書が表示されます

### 3. 結果の活用

生成された仕様書のページでは以下の操作が可能です：

- **📋 テキストをコピー**: プレーンテキスト形式で仕様書をクリップボードにコピー
- **🖨️ 印刷**: ブラウザの印刷機能で仕様書を印刷またはPDF化

## ⚙️ 技術仕様

- **Manifest Version**: V3（最新のChrome拡張機能仕様）
- **言語**: JavaScript（フレームワーク不要）
- **対応ブラウザ**: Google Chrome、Chromium系ブラウザ
- **権限**:
  - `activeTab`: 現在のタブへのアクセス
  - `scripting`: content scriptの注入
- **ストレージ**: Chrome Storage API（ローカルストレージ）

## 🔮 今後の拡張予定

現在、仕様書生成処理は**ダミー関数**として実装されています。

### 将来的な改善計画

1. **AI API統合**
   - OpenAI API（ChatGPT）
   - Claude API
   - Google Gemini API
   などのAIサービスと連携して、実際の要約処理を実装

2. **カスタマイズ機能**
   - 仕様書のフォーマットをカスタマイズ可能に
   - 出力言語の選択（日本語/英語）
   - 詳細度の調整

3. **エクスポート機能**
   - Markdown形式でのエクスポート
   - PDF直接出力
   - Notion、Confluence等への連携

## 📝 開発メモ

### content.jsの本文抽出ロジック

以下の要素を除外して本文テキストのみを抽出：
- `<script>`, `<style>`: スクリプトとスタイル
- `<nav>`, `<header>`, `<footer>`: ナビゲーションとヘッダー/フッター
- `<aside>`: サイドバー
- `<iframe>`, `<noscript>`: 埋め込みコンテンツ

### メッセージング構造

```
popup.js → content.js: 'getPageContent'
content.js → popup.js: {success, data: {title, url, content, ...}}
popup.js → background.js: 'generateSpec'
background.js → Chrome Storage: 仕様書データを保存
result.js ← Chrome Storage: 仕様書データを読み込み
```

## 🐛 トラブルシューティング

### 拡張機能が動作しない場合

1. **Service Workerのエラーを確認**
   - `chrome://extensions/` を開く
   - 拡張機能の「エラー」ボタンをクリック
   - コンソールのエラーメッセージを確認

2. **権限の確認**
   - manifest.jsonのpermissionsが正しく設定されているか確認

3. **再読み込み**
   - `chrome://extensions/` で拡張機能の「再読み込み」ボタンをクリック

### ページ内容が取得できない場合

- 一部のWebサイトでは、Content Security Policy（CSP）により拡張機能がブロックされる可能性があります
- chrome:// や chrome-extension:// のページでは動作しません

## 📄 ライセンス

このプロジェクトは学習・開発用のサンプルです。自由に改変・利用できます。

## 👨‍💻 開発者

Chrome拡張機能開発の参考実装として作成されました。

---

**注意**: 現在の仕様書生成機能はダミー実装です。実際にAI APIと連携することで、より高度な要約・分析が可能になります。
