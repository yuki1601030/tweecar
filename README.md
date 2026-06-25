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

左側のシーン説明写真は、用意された画像をそのまま大きく表示するための領域です。以下のファイル名で `public/assets/scenes/` に配置してください。

- `sceneA1.png`
- `sceneA2.png`
- `sceneA3.png`
- `sceneA4.png`
- `sceneB5.png`
- `sceneB6.png`
- `sceneB7.png`
- `sceneB8.png`

画像パスは GitHub Pages でも壊れないように `src/data/scenes.js` で `import.meta.env.BASE_URL` を使って組み立てています。

## このプロトタイプの目的

ユーザーテストで、説明文を読ませるのではなく、画面を見た瞬間に「A車の運転手としてこういう状況にいる」と理解できることを目指しています。

- 左側：シーン説明写真を大きく表示し、状況理解に集中するエリア
- 右側：A車の運転者体験 UI として、前方道路・ダッシュボード・車載ナビ・AI 会話を重ねたエリア
- ナビ内の **CARS** ボタンを押すと、PC 音声で注意喚起が流れます。
- ユーザーテストでは、写真による状況理解のしやすさと、右側体験 UI の没入感を確認します。
- GitHub Pages で画像が壊れないように、画像参照には `import.meta.env.BASE_URL` を使っています。

## 音声読み上げの使い方

右側のナビ画面にある「CARS」ボタン、または下部の「CARSを聞く」ボタンを押すと、ブラウザの `speechSynthesis` / `SpeechSynthesisUtterance` を使って PC 音声で注意を読み上げます。

- `utterance.lang = "ja-JP"`
- `utterance.rate = 0.9`
- `utterance.volume = 1`
- 読み上げ中はボタンが「読み上げ中...」になり、会話パネルの波形が強調されます。

## ユーザーテストで確認したいこと

- 左側の写真だけでシーン状況が直感的に伝わるか
- 右側で A車の運転者として没入できるか
- AI と運転手が音声で会話している感じがあるか
- ナビ内の CARS ボタンで PC 音声が流れることが、体験理解に効くか
- 写真・会話・音声体験だけで、説明資料なしに理解できるか

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

## 写真が表示されないときの確認ポイント

写真ファイルは必ず `public/assets/scenes/` に入れてください。現在の画面は、`src/data/scenes.js` で次のファイル名を参照します。

- `sceneA1.png`
- `sceneA2.png`
- `sceneA3.png`
- `sceneA4.png`
- `sceneB5.png`
- `sceneB6.png`
- `sceneB7.png`
- `sceneB8.png`

GitHub Pages ではサイトが `/tweecar/` のようなリポジトリ名つきの場所で公開されるため、画像パスは `/assets/...` のように書かず、必ず `import.meta.env.BASE_URL` を使って組み立てます。

写真が出ない場合は、以下を確認してください。

- ファイル名が `sceneA1.png` 〜 `sceneB8.png` と完全に一致しているか。
- 拡張子が `.png` になっているか。`.jpg` / `.jpeg` / `.webp` のままだと、現在の参照パスとは一致しません。
- 大文字小文字が一致しているか。`sceneA1.png` と `SceneA1.png` は GitHub Pages 上では別ファイルとして扱われます。
- ファイル名にスペースや日本語が入っていないか。
- `public/assets/scenes/` ではなく別フォルダに入っていないか。
- 画面に「画像を読み込めません」と出た場合は、表示された「参照パス」と GitHub 上の実際のファイル名を見比べてください。
