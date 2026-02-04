# Document Rule Checker - 文書ルールチェッカー

PDFやWordファイルを読み込んで、文章のルール違反をチェックするツールです。

## 目次
1. [必要なもの](#必要なもの)
2. [インストール手順](#インストール手順)
3. [基本的な使い方](#基本的な使い方)
4. [ルールの指定方法](#ルールの指定方法)
5. [APIキーなしで使う方法](#apiキーなしで使う方法)
6. [オプション一覧](#オプション一覧)

---

## 必要なもの

- Python 3.9以上
- （オプション）Anthropic APIキー（高精度なチェックを行う場合）

---

## インストール手順

### ステップ1: Pythonの確認

ターミナル（コマンドプロンプト）を開いて、以下を入力してください：

```bash
python --version
```

`Python 3.9.x` のように表示されればOKです。

### ステップ2: 必要なライブラリをインストール

```bash
# このフォルダに移動
cd document_rule_checker

# ライブラリをインストール
pip install -r requirements.txt
```

### ステップ3: APIキーの設定（高精度チェックを使う場合のみ）

1. https://console.anthropic.com/ でアカウントを作成
2. APIキーを取得
3. `.env` ファイルを作成して設定：

```bash
# .env.example をコピー
cp .env.example .env

# .env ファイルを開いて、APIキーを設定
# ANTHROPIC_API_KEY=sk-ant-xxxxx...
```

---

## 基本的な使い方

### 例1: PDFファイルをチェック（APIキーあり）

```bash
python main.py 報告書.pdf
```

### 例2: Wordファイルをチェック（APIキーあり）

```bash
python main.py 企画書.docx
```

### 例3: APIキーなしで簡易チェック

```bash
python main.py 報告書.pdf --offline
```

---

## ルールの指定方法

### 方法1: テキストで直接指定する

```bash
python main.py 文書.pdf --rule-text "です・ます調で統一してください"
```

複数のルールを指定：

```bash
python main.py 文書.pdf --rule-text "です・ます調で統一" --rule-text "専門用語は避ける"
```

### 方法2: テキストファイルから読み込む

`my_rules.txt` というファイルを作成：

```
語尾は「です・ます調」で統一すること
専門用語を使う場合は必ず説明を付けること
一文は60文字以内にすること
```

実行：

```bash
python main.py 文書.pdf --rule-file my_rules.txt
```

### 方法3: JSONファイルで詳細に定義

`custom_rules.json` を作成：

```json
{
  "rules": [
    {
      "id": "CUSTOM001",
      "name": "語尾の統一",
      "description": "です・ます調で統一する",
      "severity": "high"
    }
  ]
}
```

実行：

```bash
python main.py 文書.pdf --rules custom_rules.json
```

---

## APIキーなしで使う方法

### オフラインモード（`--offline`）

APIキーがなくても、正規表現ベースの簡易チェックが使えます：

```bash
python main.py 文書.pdf --offline
```

**オフラインモードでチェックできる項目：**
- 語尾の不統一（です・ます/だ・である混在）
- 表記ゆれ（サーバ/サーバー、ユーザ/ユーザー等）
- 冗長表現（することができる、という等）
- 二重敬語（おっしゃられる等）
- 長すぎる文（100文字以上）

**注意：** オフラインモードはAPIモードより精度が低いです。
高精度なチェックにはAPIキーの設定をおすすめします。

---

## オプション一覧

| オプション | 短縮形 | 説明 | 例 |
|-----------|--------|------|-----|
| `--rules` | `-r` | JSONルールファイルを指定 | `--rules my_rules.json` |
| `--rule-file` | `-rf` | テキストルールファイルを指定 | `--rule-file rules.txt` |
| `--rule-text` | `-rt` | ルールを直接指定（複数可） | `--rule-text "ルール内容"` |
| `--offline` | | APIなしの簡易チェック | `--offline` |
| `--severity` | `-s` | 表示する重要度 | `--severity medium` |
| `--output` | `-o` | 結果をJSONで保存 | `--output result.json` |
| `--quiet` | `-q` | 出力を簡潔に | `--quiet` |
| `--help` | `-h` | ヘルプを表示 | `--help` |

---

## 出力例

```
============================================================
チェック結果
============================================================

[1] R001: 語尾の統一
    重要度: 高
    違反箇所:
      "本製品は高性能です。しかし、価格も高い。"
    理由:
      「です・ます調」と「だ・である調」が混在しています
    修正案:
      本製品は高性能です。しかし、価格も高いです。

--- 検出結果サマリー ---
  違反総数: 3件
    - 高 (High):   1件
    - 中 (Medium): 1件
    - 低 (Low):    1件
```

---

## トラブルシューティング

### 「ModuleNotFoundError」が出る

ライブラリがインストールされていません：

```bash
pip install -r requirements.txt
```

### 「APIキーが設定されていません」が出る

1. `.env` ファイルを作成していますか？
2. APIキーが正しいですか？
3. `--offline` オプションでAPIなしで使うこともできます

### PDFのテキストが抽出できない

画像ベースのPDF（スキャンしたもの）はテキスト抽出できません。
OCR処理が必要です。

---

## ライセンス

MIT License
