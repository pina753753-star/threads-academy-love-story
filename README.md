# Threads学園 恋物語 〜桜の散らない春〜

スマホ縦画面で遊べる、React + Vite 製の乙女ゲームです。Vercel にそのままデプロイできる構成にしています。

## ゲーム概要

- タイトル：Threads学園 恋物語 〜桜の散らない春〜
- ジャンル：スマホ向け乙女ゲーム
- 攻略対象：わたげ / こもりん / ゆっけ / よはく / なぎ / らん
- 進行：スタート画面 → 週間選択 → 好感度によるルート分岐 → エンディング
- エンディング：ハッピーエンド / 友情エンド / バッドエンド

## 開発環境

```bash
npm install
npm run dev
```

開発サーバー起動後、表示された URL をブラウザまたはスマホの検証環境で開いてください。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist` に出力されます。

## 画像追加ルール

初期状態では画像なしでも動作するように、CSS のグラデーションカードを表示しています。

画像を追加する場合は、`public/images` に配置し、React 側では必ず `/images/ファイル名` 形式で参照してください。画像ファイル名は実際に追加したファイル名に合わせて設定してください。

## Vercel 設定

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

`vercel.json` では SPA として直接 URL を開いても `index.html` に戻る rewrite を設定しています。
