/** 指板上のドットに表示するラベルの種類 */
export type DisplayMode = 'note' | 'interval';

/** コードタイプの定義 */
export interface ChordType {
  label: string;    // UI 表示名（例: "Major"）
  symbol: string;   // Tonal.js に渡す記号（例: "M"）
}

/** 度数ドットのスタイル定義 */
export interface DotStyle {
  fill: string;    // 塗り色（hex）
  stroke: string;  // 枠線色（hex）
  text: string;    // テキスト色（hex）
}

/** useChord フックが返す値 */
export interface ChordData {
  /** 構成音リスト（ピッチクラス, 例: ["C","E","G"]） */
  notes: string[];
  /** 構成音 Set（高速検索用） */
  noteSet: Set<string>;
  /** 構成音ごとの度数ラベル（例: { C: "R", E: "3", G: "5" }） */
  intervalMap: Record<string, string>;
}
