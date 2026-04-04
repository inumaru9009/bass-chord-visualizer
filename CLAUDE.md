# CLAUDE.md — Bass Chord Visualizer

## このファイルの目的
Claude Codeがこのリポジトリで作業する際の行動指針。
必ずこのファイルを最初に読み、CONTEXT.mdと合わせて参照すること。

## 作業前チェックリスト
- [ ] `CONTEXT.md` を読んで技術スタック・構成を把握する
- [ ] `git status` で現在の状態を確認する
- [ ] `npm run build` でビルドが通ることを確認してから作業開始

## コーディング規約

### 全般
- **既存ロジックを尊重する**: 指板描画・コード計算の既存実装は可能な限り保持し、機能追加の形で実装する
- コンポーネントは `src/components/` に配置
- カスタムフックは `src/hooks/` に配置
- 純粋関数・ユーティリティは `src/utils/` に配置

### React
- 関数コンポーネント + Hooks のみ使用（クラスコンポーネント禁止）
- `useState`, `useEffect`, `useCallback`, `useMemo` を適切に使い分ける
- propsの型コメントを JSDoc で簡潔に記載する

### スタイリング
- Tailwind CSSユーティリティクラスを優先
- Tailwindで対応できない細かい値（弦の太さ、インレイ座標など）はインラインスタイルまたはCSS変数を使用
- `position: fixed` は**使用禁止**（Vercelのiframe環境で問題が起きるため）
- カラーはCSS変数（`--accent`, `--bg-primary` など）を使うこと。ハードコード禁止

### SVG（指板描画）
- 弦の太さ: 4弦=3.5px, 3弦=2.5px, 2弦=1.8px, 1弦=1.2px（変更しないこと）
- インレイドット: 3,5,7,9フレット=シングル、12フレット=ダブル、色=`#b8964a`
- ノート描画はインレイドットより前面（z-order）に描くこと

### Tonal.js
- `@tonaljs/tonal` からインポートする
- バリデーションロジックは `src/hooks/useChordValidation.js` に集約する
- `Chord.get()` の結果が `notes.length === 0` の場合は無効コードとして扱う

## 禁止事項
- `position: fixed` の使用
- カラーのハードコード（CSS変数を使うこと）
- 既存の指板描画ロジックの無断削除・大幅改変
- `console.log` をコミットに含めること

## コミット規約
```
feat: 新機能追加
fix: バグ修正
style: スタイル変更（ロジック変更なし）
refactor: リファクタリング
chore: ビルド・設定変更
```

## デプロイ
- `main` ブランチへの push で Vercel が自動デプロイ
- **必ず `npm run build` が通ることを確認してからpushする**
- 本番URL: https://bass-chord-visualizer.vercel.app/

## よくある作業パターン

### 新しいコードタイプを追加したい
1. `src/utils/chordUtils.js` の `ALL_CHORD_TYPES` 配列に追加
2. `useChordValidation.js` のバリデーションが自動で対応する（追加作業不要）

### 指板のフレット数を変更したい
1. `src/components/Fretboard.jsx` の `FRET_COUNT` 定数を変更
2. インレイドットの座標計算が定数を参照していることを確認する

### UIテーマを変更したい
1. `src/index.css` または `tailwind.config.js` のCSS変数を変更する
2. コンポーネント側は変数参照なのでCSS変数の変更だけで反映される
