/** SVG 指板のレイアウト定数（座標・サイズのみ。色は constants/intervalColors.ts を参照）。 */

export const FRET_WIDTH = 44;      // 1フレット分の幅 (px)
export const STRING_HEIGHT = 38;   // 弦間の高さ (px)
export const LEFT_MARGIN = 32;     // 弦ラベル用左余白
export const TOP_MARGIN = 20;      // フレット番号用上余白
export const BOTTOM_MARGIN = 18;   // フレットマーカー用下余白
export const DOT_RADIUS = 13;      // 音ドットの半径

/** ポジションマーカーを表示するフレット番号 */
export const FRET_MARKERS = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21]);

/** ダブルドットを表示するフレット番号 */
export const DOUBLE_MARKERS = new Set([12]);
