# Development Log

## セッション 1 — 2026-04-04

### 概要
Bass Chord Visualizer の初期構築から GitHub 初回プッシュまで。

---

### 実施内容

#### 1. プロジェクト立ち上げ
- `npm create vite@latest` で React + TypeScript テンプレートを作成（`bass-app/`）
- 依存関係インストール: `tonal`, `tone`, `lucide-react`, `tailwindcss`, `typescript`
- Tailwind CSS v4（`@tailwindcss/vite` プラグイン）を設定

#### 2. 初期実装（JSX）
- `src/lib/musicTheory.js` — Tonal.js によるコード計算・指板マップ生成
- `src/lib/audio.js` — Tone.js による音声再生
- `src/components/Fretboard.jsx` — div + Tailwind による指板表示
- `src/components/ChordInfo.jsx` — 構成音表示・フィルターUI

#### 3. アーキテクチャ計画に沿ったリファクタリング（JSX → TSX）
アーキテクチャ計画:
- `App.tsx`: 全体レイアウト・ステート管理
- `Controls`: ルート音・コードタイプ・表示モード選択 UI
- `Fretboard` > `StringRow` > `NoteDot`: SVG ベースの指板
- `Legend`: 度数カラー凡例

主な変更:
- 全ファイルを `.jsx/.js` → `.tsx/.ts` に移行、TypeScript strict モード有効化
- **指板を DOM div から SVG に刷新** — 精密な座標計算が可能に
- `tuning: string[]` を props 経由で注入（将来の 5 弦対応を考慮）

#### 4. Requirements.md / Architecture.md 作成
- `Requirements.md`: 機能要件（FR-1〜6）・非機能要件・スコープ外を定義
- `Architecture.md`: ディレクトリ構造・レイヤー図・ステート管理・データフロー・コンポーネント仕様

#### 5. ディレクトリ構造の再構成
Architecture.md に定義した構造に従い再構成:

```
src/
├── types/music.ts            ← DisplayMode, ChordType, DotStyle, ChordData
├── constants/
│   ├── tuning.ts             ← DEFAULT_TUNING, STRING_LABELS, NUM_FRETS
│   └── intervalColors.ts    ← DOT_STYLES, getDotStyle(), isTriadTone()
├── hooks/useChord.ts         ← コード計算のメモ化フック
├── lib/
│   ├── musicTheory.ts        ← 純粋関数（React 非依存）
│   └── audio.ts              ← Tone.js ラッパー
└── components/
    ├── Controls/index.tsx
    ├── ChordPanel/index.tsx
    ├── Fretboard/
    │   ├── index.tsx
    │   ├── StringRow.tsx
    │   ├── NoteDot.tsx
    │   └── layout.ts         ← SVG 座標定数のみ
    └── Legend/index.tsx
```

#### 6. Tonal.js を使った R/3度/5度の色分け表示
**問題点（修正前）:**
- 半音数の手動計算（異名同音で誤判定リスク）
- `StringRow` がフレットごとに独自再計算（`useChord` との二重計算）
- トライアド音（R/3/5）と拡張音（7度など）が視覚的に区別されていない

**修正内容:**
- `buildIntervalMap()` を追加 — `Chord.get().intervals`（Tonal.js）を直接使用
  - `'1P' → 'R'`, `'3M' → '3'`, `'5P' → '5'` など、Tonal の区間記法から変換
- `useChord` フックが `intervalMap` を返すよう更新
- `StringRow` は `intervalMap[noteName]` を参照（再計算廃止）
- `isTriadTone()` を `intervalColors.ts` に追加
- `NoteDot`: トライアド音はフルサイズ＋外側リング、拡張音は 75% サイズ・65% 透明度

#### 7. スマホ横向きレスポンシブ対応

**問題:** 指板 SVG が固定 1004px → スマホで横スクロール必要

**実装（`Fretboard/index.tsx`）:**
```tsx
<div style={{ width: '100%', overflowX: 'auto' }} className="fretboard-scroll">
  <svg
    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    width="100%"
    preserveAspectRatio="xMinYMid meet"
    style={{ display: 'block', maxWidth: svgWidth, height: 'auto' }}
  >
```
- `viewBox` で内部座標系を固定（レイアウト定数の変更なし）
- `width="100%"` + `preserveAspectRatio` でコンテナ幅にスケール
- `maxWidth: svgWidth` で PC では拡大しない

**DevTools 検証結果:**
| ビューポート | SVG 幅 | フレット21 | 横スクロール |
|---|---|---|---|
| iPhone SE 横 667px | 603px | ✓ | なし |
| iPhone 14 Pro 横 932px | 821px | ✓ | なし |
| PC 1280px | 992px | ✓ | なし |

#### 8. スクロールバースタイリング（`index.css`）
```css
.fretboard-scroll::-webkit-scrollbar { height: 4px; }
.fretboard-scroll::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.35);
}
/* Firefox */
.fretboard-scroll { scrollbar-width: thin; }
```

#### 9. Git 初期化 → GitHub プッシュ
```bash
git init
git add .
git commit -m "feat: initial commit - Bass Chord Visualizer"
git remote add origin https://github.com/inumaru9009/bass-chord-visualizer.git
git branch -M main
git push -u origin main
```

---

### 技術スタック確定版

| カテゴリ | ライブラリ | バージョン |
|----------|-----------|-----------|
| Framework | React | 19.x |
| Build | Vite | 8.x |
| Language | TypeScript | 6.x（strict） |
| Styling | Tailwind CSS | 4.x |
| Music Theory | Tonal.js | 6.x |
| Audio | Tone.js | 15.x |
| Icons | Lucide React | 1.x |

---

### 今後の TODO（スコープ外・将来対応）

- [ ] 5弦ベース対応（tuning props を活かした設定 UI）
- [ ] Drop D / カスタムチューニング UI
- [ ] スケール表示モード（コードトーン以外の音も表示）
- [ ] コードトーンのアルペジオ自動再生
- [ ] GitHub Pages / Vercel へのデプロイ
