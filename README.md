# 単語日記アプリ 📝

単語を入力するとAIが日記を作ってくれます ✨

## できること

- 単語を3個、5個、7個から選べます
- 入力した単語でAIが自動で日記を書いてくれる（すごい！）
- 生成された日記をコピーできる
- ブラウザで読み上げてくれる機能もつけました
- 途中で保存したり、消したりできる下書き機能

## 使った技術

今回初めて使った技術が多くて大変でした...

- React 18（フレームワーク）
- Vite（開発サーバー。めっちゃ速い）
- Netlify Functions（サーバーレス関数？よくわからないけど便利）
- OpenAI API（日記を生成してくれるAI）

## ファイルの構成

最初は全部1つのファイルに書いてたけど、コンポーネントに分けた方がいいって学んだのでこんな感じに分けました：

```
word-diary-react/
├── src/
│   ├── App.jsx              # メインのファイル
│   ├── App.css              # 見た目
│   ├── main.jsx             # Reactの起動ポイント
│   ├── components/          # パーツに分けたファイル
│   │   ├── WordInput.jsx    # 単語を入力するところ
│   │   └── DiaryResult.jsx  # 結果を表示するところ
│   ├── hooks/               # カスタムフック（ロジックをまとめたやつ）
│   │   ├── useDraft.js      # 下書き保存の処理
│   │   └── useSpeech.js     # 読み上げの処理
│   └── utils/
│       └── api.js           # API呼び出しの処理
├── netlify/
│   └── functions/
│       └── generate.js      # サーバー側の処理（APIキーを隠すため）
├── index.html
├── package.json
└── vite.config.js
```
動かし方

自分の環境で動かす場合の手順です。

### 1. ダウンロード

```bash
git clone <repository-url>
cd word-diary-react
```

### 2. 必要なパッケージをインストール

最初これ忘れてエラー

```bash
npm install
```

### 3. OpenAI APIキーの設定


プロジェクトのルートに `.env` ファイルを作って、こう書く：

```
OPENAI_API_KEY=ここにAPIキーを貼り付け
```

**APIキーの取り方：**
1. [OpenAI](https://platform.openai.com/)でアカウント作る（クレジットカード必要）
2. API keysのページで「Create new secret key」をクリック
3. 出てきたキーをコピーして `.env` に貼り付け
4. このキーは絶対に人に見せないこと！

### 4. 起動

```bashで公開する方法

課題で公開する必要があったのでNetlifyを使いました。すこし課金しました。

### 手順

1. [Netlify](https://app.netlify.com/)でアカウント作る（GitHubと連携できる）
2. "Add new site" → "Import an existing project" を選択
3. GitHubのリポジトリを選ぶ
4. ビルド設定は自動でやってくれる（`netlify.toml`があるから）
5. **重要！** 環境変数を設定する：
   - Site settings → Environment variables に行く
   - 「Add a variable」で `OPENAI_API_KEY` を追加
   - ローカルの `.env` と同じAPIキーを入れる
6. デプロイボタンを押す

あとはGitHubにpushするたびに自動で更新されます 
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
npmその他のコマンド

開発中に使ったコマンドのメモ：

```bash
# 普段はこれで起動
npm run dev

# ビルド（本番用のファイル作成）
npm run build Documentation](https://platform.openai.com/docs/) - Chat Completions APIの使用方法

### AI支援ツールの活用

学習を効率化するために、GitHub Copilot（Claude Sonnet 4.5）をプログラミングアシスタントとして活用しました。

**AIを使った学習方法：**
- コード記録

Web API課題で作りました。

### 参考にしたサイト

- [課題資料](https://esa-pages.io/p/sharing/8704/posts/5031/38aed93d61134d0eb7ba.html) - 課題の説明
- [MDN Web Docs](https://developer.mozilla.org/) - Web APIの使い方調べるのにめっちゃ見た
- [React公式ドキュメント](https://react.dev/) - Reactの基礎を学習
- [Netlify Docs](https://docs.netlify.com/) - デプロイ方法
- [OpenAI API ドキュメント](https://platform.openai.com/docs/) - APIの使い方

### GitHub Copilotを使いました

正直に書くと、GitHub Copilot（AI）を使って勉強しながら作りました。
全部AIに書かせたわけじゃなくて、わからないところを質問したり、エラーの意味を教えてもらったりしました。

**AIに聞いたこと：**
- 「useStateってどう使うの？」
- 「LocalStorageに保存するコードがわからない」
- 「エラーメッセージの意味は？」
- 「Netlify Functionsって何？」

**自分でやったこと：**
- アプリの機能を考えた
- コードを読んで理解する
- 実際に動かして確認
- コメントを書いて復習
- デプロイして公開

### 使ったWeb API（課題要件）

1. **LocalStorage API** - 下書きを保存する機能（[useDraft.js](src/hooks/useDraft.js)）
2. **

- OpenAI APIは使った分だけお金かかります（無料枠もあるけど）
- APIキーは絶対にGitHubに上げないこと！！（.gitignoreに入れてある）
- 本番環境（Netlify）のAPIキーはダッシュボードで別に設定する

## ライセンス

MIT（自由に使ってOK）インポーネントに分けるの最初面倒だと思ったけど、あとで修正するとき楽だった
- Netlify便利すぎる。サーバー立てなくていいのすごい
- APIキーの管理大事（最初Gitに上げそうになった...危ない）
- エラーが出たときはちゃんと読むと意外と解決できる