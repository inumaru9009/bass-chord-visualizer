# CONTEXT.md — Bass Chord Visualizer

## プロジェクト概要
ベーシスト向けのコード指板ビジュアライザー。
ルート音とコードタイプを選択すると、4弦ベースの指板上に押さえるポジションをリアルタイムで表示する。

## 公開情報
- **本番URL**: https://bass-chord-visualizer.vercel.app/
- **リポジトリ**: https://github.com/inumaru9009/bass-chord-visualizer
- **ホスティング**: Vercel（mainブランチへのpushで自動デプロイ）

## 技術スタック
- **フレームワーク**: React + Vite
- **スタイリング**: Tailwind CSS + カスタムCSS
- **コード解析**: Tonal.js (`@tonaljs/tonal`)
- **指板描画**: SVG

## ディレクトリ構成
```
src/
├── components/
│   ├── Fretboard.jsx        # 指板（インレイ・弦太さ・ノート表示）
│   ├── ControlPanel.jsx     # 左パネル（ルート・コードタイプ・トグル）
│   ├── Tooltip.jsx          # ツールチップコンポーネント
│   └── Layout.jsx           # 2カラムレイアウト管理
├── hooks/
│   ├── useChordValidation.js  # Tonal.jsバリデーションロジック
│   └── useSidebar.js          # サイドバー開閉状態管理
├── utils/
│   └── chordUtils.js          # 度数計算ユーティリティ
└── App.jsx
```

## 主要機能
- **指板表示**: 4弦ベース、フレット0〜12を視覚化
- **インレイドット**: 3, 5, 7, 9フレット（シングル）、12フレット（ダブル）
- **弦の太さ差別化**: 4弦(3.5px) → 3弦(2.5px) → 2弦(1.8px) → 1弦(1.2px)
- **度数/音名トグル**: デフォルト度数表示（R, b3, 5, b7 など）
- **双方向バリデーション**: 無効なルート/コードタイプをリアルタイムで非活性化
- **ツールチップ**: 「？」アイコンで初心者向け用語解説
- **2カラムレイアウト**: 左パネル開閉可（デスクトップ）、アコーディオン（モバイル）

## デザイン方針
- ダークテーマ固定（楽器アプリらしい雰囲気）
- アクセントカラー: ゴールド系 `#e8a84c`
- インレイカラー: `#b8964a`
- パネル開閉・アコーディオンにCSSトランジションアニメーション

## カラー変数
```css
--bg-primary: #0f1117
--bg-secondary: #181c27
--bg-panel: #12151f
--accent: #e8a84c
--accent-hover: #c47d2a
--text-primary: #e8e8e8
--text-muted: #8892a4
--border: rgba(255,255,255,0.08)
--inlay-color: #b8964a
```

## デプロイ手順
```bash
npm run build        # ビルド確認
git add -A
git commit -m "..."
git push origin main # Vercelが自動デプロイ
```
