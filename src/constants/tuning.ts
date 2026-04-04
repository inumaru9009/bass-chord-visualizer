/** デフォルトチューニング。index 0 = 最高音弦（タブ譜上段）。 */
export const DEFAULT_TUNING: string[] = ['G2', 'D2', 'A1', 'E1'];

/** 弦ラベル（チューニングと同順） */
export const STRING_LABELS: string[] = ['G', 'D', 'A', 'E'];

/** 表示フレット数（0 フレット＝開放弦を含まないフレット数） */
export const NUM_FRETS = 21;

/**
 * チューニングプリセット。
 * 配列順は高音弦 → 低音弦（index 0 = 1弦 = G系、index 3 = 4弦 = E系）。
 */
export const TUNINGS = {
  standard: ['G2', 'D2', 'A1', 'E1'],   // 標準 (GDAE)
  dropD:    ['G2', 'D2', 'A1', 'D1'],   // Drop D
  halfDown: ['Gb2', 'Db2', 'Ab1', 'Eb1'], // 半音下げ
  fullDown: ['F2',  'C2',  'G1',  'D1'],  // 全音下げ
} as const;

export type TuningKey = keyof typeof TUNINGS;

export const TUNING_LABELS: Record<TuningKey, string> = {
  standard: 'Standard',
  dropD:    'Drop D',
  halfDown: 'Half Down',
  fullDown: 'Full Down',
};

export const STRING_LABELS_BY_TUNING: Record<TuningKey, readonly string[]> = {
  standard: ['G',  'D',  'A',  'E'],
  dropD:    ['G',  'D',  'A',  'D'],
  halfDown: ['Gb', 'Db', 'Ab', 'Eb'],
  fullDown: ['F',  'C',  'G',  'D'],
};
