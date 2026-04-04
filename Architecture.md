# Architecture

## ディレクトリ構造

```
src/
├── main.tsx                        # エントリーポイント
├── App.tsx                         # ルートコンポーネント・グローバルステート
├── index.css                       # Tailwind CSS エントリー
│
├── types/                          # 共有 TypeScript 型定義
│   └── music.ts                    # DisplayMode, ChordState, DotStyle など
│
├── constants/                      # アプリ全体で共有される定数
│   ├── tuning.ts                   # DEFAULT_TUNING, STRING_LABELS
│   └── intervalColors.ts           # 度数 → 色マッピング (DOT_STYLES)
│
├── lib/                            # 純粋関数（React 非依存）
│   ├── musicTheory.ts              # コード計算・指板マップ生成・度数変換
│   └── audio.ts                    # Tone.js ラッパー（音声再生）
│
├── hooks/                          # カスタム React フック
│   └── useChord.ts                 # コード選択ステート + 派生データ（構成音・度数）
│
└── components/                     # UI コンポーネント
    ├── Controls/
    │   └── index.tsx               # ルート音・コードタイプ・表示モード選択 UI
    ├── ChordPanel/
    │   └── index.tsx               # 構成音バッジ・フィルターボタン
    ├── Fretboard/
    │   ├── index.tsx               # SVG キャンバス・フレット/マーカー描画
    │   ├── StringRow.tsx           # 1弦分の描画（弦ライン + NoteDot 配置）
    │   ├── NoteDot.tsx             # クリック可能な音ドット（SVG circle + text）
    │   └── layout.ts               # SVG レイアウト定数（座標・サイズ）
    └── Legend/
        └── index.tsx               # 度数カラー凡例
```

---

## レイヤー構造

```
┌─────────────────────────────────────┐
│            App.tsx                  │  グローバルステート管理
├──────────┬────────────┬─────────────┤
│ Controls │ ChordPanel │  Fretboard  │  UI コンポーネント
│          │            │  └ StringRow│
│          │            │    └ NoteDot│
└──────────┴──────┬─────┴─────────────┘
                  │ 呼び出し
         ┌────────┴────────┐
         │   hooks/        │  React ステート + メモ化
         │   useChord.ts   │
         └────────┬────────┘
                  │ 呼び出し
         ┌────────┴────────┐
         │   lib/          │  純粋関数（React 非依存）
         │   musicTheory   │
         │   audio         │
         └────────┬────────┘
                  │ 使用
         ┌────────┴────────┐
         │   constants/    │  定数・設定値
         │   types/        │  型定義
         └─────────────────┘
```

---

## ステート管理

すべてのグローバルステートは `App.tsx` で `useState` により管理し、props 経由で子コンポーネントへ渡す。

| ステート | 型 | 初期値 | 説明 |
|----------|----|--------|------|
| `selectedRoot` | `string` | `"C"` | 選択中のルート音 |
| `selectedType` | `string` | `"M"` | 選択中のコードタイプ記号 |
| `displayMode` | `DisplayMode` | `"note"` | 音名 / 度数 の表示切り替え |
| `activeFilter` | `string` | `"all"` | 強調する度数（`"all"` = 全表示） |
| `tuning` | `string[]` | `["G2","D2","A1","E1"]` | チューニング（高音弦 = index 0） |

### ステート変更ルール

- `selectedRoot` / `selectedType` を変更すると `activeFilter` を `"all"` にリセットする
- `tuning` は現時点で定数だが、将来の設定 UI 追加を考慮して `App.tsx` で保持する

---

## データフロー

```
ユーザー操作（コード選択）
       │
       ▼
  App.tsx でステート更新
       │
       ├─► useChord(root, type)
       │     ├─ Tonal.Chord.get() → 構成音リスト
       │     └─ getSemitones() × N → 度数ラベルリスト
       │
       ├─► ChordPanel（構成音バッジ・フィルターボタン表示）
       │
       └─► Fretboard
             ├─ buildFretboard(tuning) → 全フレット音名マップ
             └─ 各 StringRow → NoteDot（コードトーンのみレンダリング）

ユーザー操作（フレットクリック）
       │
       ▼
  NoteDot.onClick
       │
       └─► audio.playNote(stringIndex, fret, tuning)
             └─ Tone.PolySynth.triggerAttackRelease(noteName)
```

---

## コンポーネント仕様

### `App.tsx`
- グローバルステートの保持と更新ハンドラの定義
- `tuning` と `stringLabels` の定数を定義して `Fretboard` に注入

### `Controls/index.tsx`
- **Props**: `selectedRoot`, `selectedType`, `displayMode`, `onRootChange`, `onTypeChange`, `onDisplayModeChange`
- 音楽理論ロジックを持たない純粋な UI

### `ChordPanel/index.tsx`
- **Props**: `selectedRoot`, `selectedType`, `activeFilter`, `onFilterChange`
- 内部で `getChordNotes` / `getIntervalLabel` を呼び、構成音バッジとフィルターボタンを描画

### `Fretboard/index.tsx`
- **Props**: `selectedRoot`, `selectedType`, `displayMode`, `activeFilter`, `tuning`, `stringLabels`
- SVG 全体のサイズ計算・フレット縦線・マーカードット・弦ラベルを担当
- 各弦を `StringRow` コンポーネントに委譲

### `Fretboard/StringRow.tsx`
- **Props**: 弦インデックス・弦の全音名配列・コードトーンSet・表示モード・フィルター・チューニング
- 弦ラインと `NoteDot` の座標計算を担当

### `Fretboard/NoteDot.tsx`
- **Props**: SVG 座標 (cx, cy)・度数ラベル・音名・表示モード・onClick
- クリックイベントのみを持ち、音声再生は親（StringRow）経由で呼ぶ

### `Legend/index.tsx`
- Props なし
- `constants/intervalColors.ts` の `DOT_STYLES` を読み取って凡例を描画

---

## 定数・型の分離方針

| ファイル | 内容 |
|----------|------|
| `types/music.ts` | `DisplayMode`, `ChordType`, `DotStyle` 型 |
| `constants/tuning.ts` | `DEFAULT_TUNING`, `STRING_LABELS`, `NUM_FRETS` |
| `constants/intervalColors.ts` | `DOT_STYLES`（度数 → fill/stroke/text カラーマップ） |
| `lib/musicTheory.ts` | `CHORD_TYPES`, `ROOT_NOTES`, 純粋関数群 |
| `components/Fretboard/layout.ts` | SVG 座標系定数（`FRET_WIDTH`, `STRING_HEIGHT` 等） |

> **方針**: コンポーネント内にハードコードされた色・数値は上記ファイルに集約し、
> コンポーネントはロジックを持たず「どのデータをどう表示するか」のみを記述する。
