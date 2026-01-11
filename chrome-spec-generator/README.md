# 🎨 CSS図解ツール Chrome拡張機能

Webページ上の任意の要素を選択して、CSS・HTML構造を視覚的に図解するChrome拡張機能です。

## 🎯 概要

この拡張機能は、開発者がWebページの要素を調査・分析する際に役立ちます。要素を選択するだけで、以下の情報を自動的に抽出し、視覚的に図解します。

### 図解される内容

1. **📦 CSSボックスモデル図**
   - margin, border, padding, contentの視覚的な構造
   - 各レイヤーのサイズ（px単位）

2. **📄 HTML情報**
   - タグ名
   - ID、クラス
   - 属性一覧

3. **🎨 CSSプロパティ**
   - 適用されているすべてのComputedスタイル
   - display, position, flex/grid設定
   - 色、フォント、サイズなど

4. **🌲 階層構造**
   - 親要素
   - 現在の要素（選択中）
   - 子要素一覧

5. **💻 HTMLコード**
   - 要素のouterHTML

## 📁 フォルダ構成

```
chrome-spec-generator/
├── manifest.json           # Chrome拡張機能のマニフェストファイル（Manifest V3）
├── popup.html              # 拡張機能アイコンクリック時のポップアップUI
├── popup.js                # ポップアップのロジック（選択モード開始・キャンセル）
├── content.js              # Webページに注入されるスクリプト（要素選択・情報取得）
├── background.js           # バックグラウンドService Worker（情報保存）
├── result.html             # CSS図解を表示するページ
├── result.js               # 図解レンダリングロジック
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
- 必要な権限（activeTab, scripting, storage）を定義

### popup.html / popup.js
- 拡張機能アイコンをクリックした際に表示されるUI
- 「要素を選択」ボタンで選択モードを開始
- 「選択をキャンセル」ボタンで選択モードを終了

### content.js
- 各Webページに注入されるスクリプト
- **要素選択機能**: マウスオーバーで要素をハイライト、クリックで選択
- **情報取得機能**: 選択された要素のCSS、HTML、ボックスモデル情報を抽出
- **セレクタパス生成**: 要素を一意に特定するCSSセレクタを自動生成

### background.js
- バックグラウンドで動作するService Worker
- content.jsから送信された要素情報を受信
- Chrome Storage APIに保存

### result.html / result.js
- 新しいタブで開かれる図解表示ページ
- CSSボックスモデルを視覚的に描画
- CSS プロパティをテーブル形式で表示
- HTML構造と階層を整形して表示
- CSS情報をクリップボードにコピー可能

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

### 2. 要素の選択と図解

1. 調査したいWebページを開きます
2. ブラウザのツールバーにある拡張機能のアイコン（緑の書類アイコン）をクリックします
3. ポップアップが表示されたら「🎯 要素を選択」ボタンをクリックします
4. **選択モードが開始されます**（カーソルが十字に変わります）
5. ページ上の要素にマウスオーバーすると、青いハイライトが表示されます
6. 図解したい要素をクリックします
7. 新しいタブが開き、選択した要素の詳細な図解が表示されます

### 3. 図解結果の活用

生成された図解ページでは以下の操作が可能です：

- **📦 ボックスモデル図**: margin, border, padding, contentを視覚的に確認
- **📄 HTML情報**: タグ名、ID、クラス、属性を確認
- **🎨 CSSプロパティ**: すべての適用されているスタイルを一覧表示
- **🌲 階層構造**: 親要素・子要素との関係を確認
- **💻 HTMLコード**: 要素のソースコードを表示
- **📋 CSS情報をコピー**: プレーンテキスト形式でクリップボードにコピー

## ⚙️ 技術仕様

- **Manifest Version**: V3（最新のChrome拡張機能仕様）
- **言語**: JavaScript（フレームワーク不要）
- **対応ブラウザ**: Google Chrome、Chromium系ブラウザ
- **権限**:
  - `activeTab`: 現在のタブへのアクセス
  - `scripting`: content scriptの注入
  - `storage`: 要素情報の一時保存
- **ストレージ**: Chrome Storage API（ローカルストレージ）

## 💡 主な機能

### 要素のハイライト機能
- マウスオーバーで即座に要素がハイライト表示
- スクロール位置を考慮した正確な位置計算
- 最高のz-indexで他の要素に干渉しない

### Computed Styleの取得
- `window.getComputedStyle()` を使用して実際に適用されているスタイルを取得
- デフォルト値を除外して、意味のあるプロパティのみを表示

### ボックスモデルの視覚化
- margin（赤）、border（オレンジ）、padding（緑）、content（青）を色分け
- 各レイヤーのサイズをpx単位で表示
- 入れ子構造で視覚的に理解しやすい

### セレクタパスの自動生成
- 要素を一意に特定できるCSSセレクタを自動生成
- IDがあればそこで終了、なければクラスを含めて階層を辿る

## 🔮 使用例

### ケース1: ボタンのスタイルを調査
1. ボタン要素を選択
2. padding、border-radius、background-colorなどを確認
3. ボックスモデル図で余白を視覚的に理解

### ケース2: レイアウトのデバッグ
1. レイアウトがずれている要素を選択
2. display、position、flex/gridプロパティを確認
3. marginやpaddingの設定ミスを発見

### ケース3: セレクタの確認
1. スタイルを当てたい要素を選択
2. 自動生成されたセレクタパスをコピー
3. CSSファイルでそのセレクタを使用

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

### 要素が選択できない場合

- 一部のWebサイトでは、Content Security Policy（CSP）により拡張機能がブロックされる可能性があります
- `chrome://` や `chrome-extension://` のページでは動作しません
- ページを再読み込みしてから試してください

### ハイライトがずれる場合

- ページをスクロールした後、位置がずれる場合があります
- 一度選択モードをキャンセルして、再度開始してください

## 📚 開発者向け情報

### メッセージング構造

```
popup.js → content.js: 'startSelection' (選択モード開始)
popup.js → content.js: 'cancelSelection' (選択モードキャンセル)
content.js → background.js: 'saveElementInfo' (要素情報を保存)
content.js → popup.js: 'elementSelected' (要素が選択されたことを通知)
background.js → Chrome Storage: 要素情報を保存
result.js ← Chrome Storage: 要素情報を読み込み
```

### content.jsの情報取得処理

```javascript
// 1. Computed Styleを取得
const computedStyle = window.getComputedStyle(element);

// 2. ボックスモデル情報を取得
const rect = element.getBoundingClientRect();

// 3. HTML属性を取得
const attributes = Array.from(element.attributes);

// 4. セレクタパスを生成
const selectorPath = generateSelectorPath(element);
```

### カスタマイズ

- **ハイライト色の変更**: content.js の `createHighlightOverlay()` 関数
- **表示するCSSプロパティの追加**: content.js の `getElementInfo()` 関数
- **ボックスモデル図の色**: result.html のCSS `.margin-layer`, `.border-layer` など

## 📄 ライセンス

このプロジェクトは学習・開発用のサンプルです。自由に改変・利用できます。

## 👨‍💻 開発者

Chrome拡張機能開発の参考実装として作成されました。

---

**開発者ツールの補完として使える便利ツール**

Chromeの開発者ツールと組み合わせて使用することで、より効率的なWeb開発が可能になります。
