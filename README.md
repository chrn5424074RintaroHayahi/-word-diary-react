# 単語日記 (Word Diary React)

単語を 3 / 5 / 7 個入れてAIが日記を生成するWebアプリケーションです。

## 機能

- 3個、5個、7個から単語数を選択
- 単語を入力してAIが自動的に日記を生成
- 生成された日記をコピー
- 音声で読み上げ
- 下書きの保存・復元・削除

## 技術スタック

- React 18
- Vite
- Netlify Functions
- OpenAI API (GPT-3.5-turbo)

## プロジェクト構成

```
word-diary-react/
├── netlify/
│   └── functions/
│       └── generate.js      # OpenAI API呼び出し
├── src/
│   ├── components/
│   │   ├── WordInput.jsx    # 単語入力コンポーネント
│   │   └── DiaryResult.jsx  # 日記表示コンポーネント
│   ├── hooks/
│   │   ├── useDraft.js      # 下書き管理フック
│   │   └── useSpeech.js     # 音声読み上げフック
│   ├── utils/
│   │   └── api.js           # API呼び出しユーティリティ
│   ├── App.jsx              # メインアプリケーション
│   ├── App.css              # スタイル
│   └── main.jsx             # エントリーポイント
├── index.html
├── netlify.toml             # Netlify設定
├── package.json
└── vite.config.js
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd word-diary-react
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env` ファイルを作成し、OpenAI APIキーを設定します：

```
OPENAI_API_KEY=your-openai-api-key-here
```

**OpenAI APIキーの取得方法：**
1. [OpenAI Platform](https://platform.openai.com/)にアカウント登録
2. API keys ページで新しいキーを作成
3. キーをコピーして `.env` ファイルに設定

### 4. ローカル開発サーバーを起動

```bash
npm run dev
```

`http://localhost:8888` でアプリケーションが起動します。

## Netlifyへのデプロイ

### 1. Netlifyにリポジトリを接続

1. [Netlify](https://app.netlify.com/)にログイン
2. "Add new site" → "Import an existing project" を選択
3. GitHubなどのリポジトリをNetlifyに接続

### 2. ビルド設定

Netlifyが自動的に `netlify.toml` を読み込みますが、手動設定する場合：

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

### 3. 環境変数を設定

**重要:** Netlifyダッシュボードで環境変数を設定してください

1. Site settings → Environment variables
2. "Add a variable" をクリック
3. 以下を設定：
   - **Key:** `OPENAI_API_KEY`
   - **Value:** あなたのOpenAI APIキー
   - **Scopes:** すべてにチェック

### 4. デプロイ

設定が完了すると、自動的にデプロイされます。以降、GitリポジトリへのプッシュでCDが実行されます。

## 開発コマンド

```bash
# 開発サーバー起動（Netlify Functions込み）
npm run dev

# Viteのみ起動
npm run vite

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run serve
```

## 注意事項

- ⚠️ OpenAI APIの使用には費用がかかる場合があります
- 🔒 APIキーは絶対に公開リポジトリにコミットしないでください
- 📁 `.env` ファイルは `.gitignore` に含まれています
- 🌐 本番環境の環境変数はNetlifyダッシュボードで設定してください

## ライセンス

MIT