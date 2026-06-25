# TweeCar プロトタイプ

TweeCar は「クルマだけが読める SNS」を裏側に持ち、A車の運転者には自車 AI が要約した必要情報だけを届ける体験を検証する React + Vite プロトタイプです。

## 起動方法

```bash
npm install
npm run dev
```

本番ビルド確認は以下です。

```bash
npm run build
npm run preview
```

## 画像の配置方法

上段のシーン表示は、用意された画像をそのまま大きく表示するための領域です。以下のファイル名で `public/assets/scenes/` に配置してください。

- `sceneA1.jpg`
- `sceneA2.jpg`
- `sceneA3.jpg`
- `sceneA4.jpg`
- `sceneB5.jpg`
- `sceneB6.jpg`
- `sceneB7.jpg`
- `sceneB8.jpg`

PNG など別拡張子で使いたい場合は、`src/data/scenes.js` の `image` パスを変更してください。画像が未配置の場合は、どのファイルを置けばよいかが上段エリアに表示されます。

## このプロトタイプの目的

明日のユーザーテストで、説明文を読ませるのではなく、画面を見た瞬間に「A車の運転手としてこういう状況にいる」と理解できることを目指しています。

- 上段：状況イメージを写真で直感的に理解するための大きなシーン画像ビューア
- 下段：A車の運転者として触る、車載ナビ + AI 音声会話 UI
- 通常表示：生ツイートや内部投稿は見せず、A車 AI の要約だけを表示
- デモ表示：`Behind the scenes / 内部データを見る` を ON にした時だけ、非公開データ通信や内部投稿を小さく表示

## 音声読み上げの使い方

シーン3とシーン7で「注意を聞く」ボタンを押すと、ブラウザの `speechSynthesis` / `SpeechSynthesisUtterance` を使って PC 音声で注意を読み上げます。

- `utterance.lang = "ja-JP"`
- `utterance.rate = 0.9`
- `utterance.volume = 1`
- 読み上げ中はボタンが「読み上げ中...」になり、会話パネルの波形が強調されます。

## ユーザーテストで確認したいこと

- 上段の写真だけでシーン状況が直感的に伝わるか
- 下段で A車の運転者として没入できるか
- AI と運転手が音声で会話している感じがあるか
- 「注意を聞く」ボタンで PC 音声が流れることが、体験理解に効くか
- 生ツイートを隠し、必要情報だけ要約する設計に安心感があるか
- Privacy Guard の小カードで、個人情報や位置情報の扱いに不安が減るか

## GitHub Pages で公開する方法（初心者向け）

このプロジェクトは GitHub Pages で公開すると、URL は次の形式になります。

```text
https://<username>.github.io/tweecar/
```

公開するには、GitHub のリポジトリ画面で以下を設定してください。

1. GitHub のリポジトリを開きます。
2. 上部メニューの **Settings** を押します。
3. 左側メニューの **Pages** を押します。
4. **Build and deployment** の **Source** を **GitHub Actions** に変更します。
5. `main` ブランチに変更が push されると、自動でビルドと公開が実行されます。

白画面になった場合は、次の2点を確認してください。

- `vite.config.js` の `base` が `/tweecar/` になっていること。
- React 側の画像パスが `import.meta.env.BASE_URL` を使っていること。

GitHub Pages はリポジトリ名付きの URL 配下で配信されるため、`base` や画像パスが `/assets/...` のようなルート基準になっていると、JavaScript や画像を読み込めず白画面になることがあります。
