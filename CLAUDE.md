# CLAUDE.md — Bass Chord Visualizer

## このファイルの目的
Claude Codeがこのリポジトリで作業する際の行動指針。
必ずこのファイルを最初に読み、CONTEXT.mdと合わせて参照すること。

## 作業前チェックリスト
- [ ] `CONTEXT.md` を読んで技術スタック・構成を把握する
- [ ] `git status` で現在の状態を確認する
- [ ] `npm run build` でビルドが通ることを確認してから作業開始

## 作業フロー

### 新機能・大きな変更は必ずPlanから始める
- 実装前に `/plan` (EnterPlanMode) でアプローチを固める
- 「何を変えるか」「どのファイルに影響するか」を明確にしてから手を動かす
- 計画をユーザーに確認してから実装に入ること

### コンテキスト管理
- コンテキスト使用率が50%に達したら `/compact` でリセット
- 行き詰まったり方向性を間違えたら `Esc Esc` または `/rewind` で巻き戻す
- セッション中に大きな方針転換があれば `/clear` でリセットしてから再開

### コミット・デプロイ
- **機能単位でこまめにコミット**（最低1機能=1コミット）
- **必ず `npm run build` が通ることを確認してからpush**
- `main` ブランチへのpushでVercelが自動デプロイ
- 本番URL: https://bass-chord-visualizer.vercel.app/

### デバッグ
- ブラウザで確認できる変更は `preview_*` ツールでコンソールエラーを確認する
- SVG描画の問題はブラウザのDevToolsでviewBoxや座標値を直接確認すること
- ファイル検索は glob/grep を使う（RAGより精度が高い）

---

## コーディング規約

### 全般
- **既存ロジックを尊重する**: 指板描画・コード計算の既存実装は可能な限り保持し、機能追加の形で実装する
- コンポーネントは `src/components/` に配置
- カスタムフックは `src/hooks/` に配置
- 純粋関数・ユーティリティは `src/utils/` に配置

### React
- 関数コンポーネント + Hooks のみ使用（クラスコンポーネント禁止）
- `useState`, `useEffect`, `useCallback`, `useMemo` を適切に使い分ける
- propsの型はTypeScriptの `interface Props` で定義する

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
- バリデーションロジックは `src/hooks/useChordValidation.ts` に集約する
- `Chord.get()` の結果が `notes.length === 0` の場合は無効コードとして扱う

---

## 禁止事項
- `position: fixed` の使用
- カラーのハードコード（CSS変数を使うこと）
- 既存の指板描画ロジックの無断削除・大幅改変
- `console.log` をコミットに含めること

---

## コミット規約
```
feat: 新機能追加
fix: バグ修正
style: スタイル変更（ロジック変更なし）
refactor: リファクタリング
chore: ビルド・設定変更
```

---

## よくある作業パターン

### 新しいコードタイプを追加したい
1. `src/lib/musicTheory.ts` の `CHORD_TYPES` 配列に追加
2. `useChordValidation.ts` のバリデーションが自動で対応する（追加作業不要）

### 指板のフレット数を変更したい
1. `src/constants/tuning.ts` の `NUM_FRETS` 定数を変更
2. `src/components/Fretboard/layout.ts` のインレイ定義が定数を参照していることを確認する

### UIテーマを変更したい
1. `src/index.css` のCSS変数を変更する
2. コンポーネント側は変数参照なのでCSS変数の変更だけで反映される

### ポジション定義を変更したい
1. `src/utils/positions.ts` の `POSITIONS` 配列を編集する

---

## Claude.ai との協働ルール

### 指示を受け取るとき
- Claude.ai はリポジトリに直接アクセスできない
- 既存コードが必要な場合は Claude.ai 側から `cat` コマンドの実行を求めてくる
- 求められたら該当ファイルの内容をそのまま Claude.ai のチャットに貼り付ける

### 実装完了の報告
完了報告時は以下をセットで伝える：
1. 完了した作業の一言サマリー
2. 迷って判断した箇所があればその内容
3. 次に進んでよいか or 確認が必要か

### 曖昧な指示への対処
指示に `※実際のprop名に合わせること` 等の曖昧な箇所がある場合：
- 自分で既存コードを確認して補完してよい
- 判断できない場合のみ Claude.ai に質問する
