import type { DotStyle } from '../types/music';

/**
 * 度数ラベル → SVG ドットのスタイル。
 * Legend・NoteDot・ChordPanel の全コンポーネントが参照する唯一の色定義。
 *
 * 色設計方針:
 *   R（ルート） → 赤   … コードの基盤、最も目立つ色
 *   3度（b3/3） → 青   … メジャー／マイナーの性格を決める音
 *   5度（b5/5/#5）→ 橙   … 安定感を決める音
 *   拡張音（7度・4度など）→ 彩度を落とした寒色系、視覚的に一段低いプライオリティ
 */
export const DOT_STYLES: Record<string, DotStyle> = {
  // ── トライアド（R / 3度 / 5度） ──────────────────────────
  R:    { fill: '#ef4444', stroke: '#b91c1c', text: '#fff' },  // 赤
  'b3': { fill: '#3b82f6', stroke: '#1d4ed8', text: '#fff' },  // 青（短3度）
  '3':  { fill: '#2563eb', stroke: '#1d4ed8', text: '#fff' },  // 青（長3度）
  'b5': { fill: '#d97706', stroke: '#92400e', text: '#fff' },  // 橙（減5度）
  '5':  { fill: '#f59e0b', stroke: '#b45309', text: '#000' },  // 黄橙（完全5度）
  '#5': { fill: '#fbbf24', stroke: '#b45309', text: '#000' },  // 黄（増5度）

  // ── 拡張音（テンション・他の音程） ──────────────────────
  'b2': { fill: '#64748b', stroke: '#475569', text: '#fff' },
  '2':  { fill: '#64748b', stroke: '#475569', text: '#fff' },
  '4':  { fill: '#7c3aed', stroke: '#5b21b6', text: '#fff' },  // 紫（4度）
  'b6': { fill: '#475569', stroke: '#334155', text: '#fff' },
  '6':  { fill: '#0891b2', stroke: '#0e7490', text: '#fff' },  // シアン（6度）
  'b7': { fill: '#6366f1', stroke: '#4338ca', text: '#fff' },  // インディゴ（短7度）
  '7':  { fill: '#818cf8', stroke: '#4338ca', text: '#fff' },  // 薄インディゴ（長7度）
  '#4': { fill: '#64748b', stroke: '#475569', text: '#fff' },

  default: { fill: '#64748b', stroke: '#334155', text: '#fff' },
};

/** 度数ラベルのスタイルを安全に取得する */
export function getDotStyle(intervalLabel: string): DotStyle {
  return DOT_STYLES[intervalLabel] ?? DOT_STYLES['default'];
}

/**
 * 度数ラベルがトライアド音（ルート・3度・5度）かどうか。
 * コードの種類（M/m/aug/dim）によって3度・5度の質は変わるが、
 * 機能上の役割（第1・第3・第5音）としてまとめて判定する。
 */
export function isTriadTone(intervalLabel: string): boolean {
  return ['R', 'b3', '3', 'b5', '5', '#5'].includes(intervalLabel);
}
