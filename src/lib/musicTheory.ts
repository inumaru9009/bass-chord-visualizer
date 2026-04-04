import { Chord, Note } from 'tonal';
import { NUM_FRETS } from '../constants/tuning';
import type { ChordType } from '../types/music';

export const CHORD_TYPES: ChordType[] = [
  { label: 'Major', symbol: 'M' },
  { label: 'Minor', symbol: 'm' },
  { label: 'Dom7',  symbol: '7' },
  { label: 'Maj7',  symbol: 'maj7' },
  { label: 'Min7',  symbol: 'm7' },
  { label: 'Dim',   symbol: 'dim' },
  { label: 'Aug',   symbol: 'aug' },
  { label: 'Sus2',  symbol: 'sus2' },
  { label: 'Sus4',  symbol: 'sus4' },
];

export const ROOT_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

/**
 * Tonal.js の区間記法（例: "3M", "5P"）→ 表示用ラベル（例: "3", "5"）へのマッピング。
 * Chord.get().intervals が返す文字列を直接使うことで、異名同音の誤判定を防ぐ。
 */
const TONAL_INTERVAL_TO_LABEL: Record<string, string> = {
  '1P': 'R',
  '2m': 'b2',
  '2M': '2',
  '3m': 'b3',
  '3M': '3',
  '4P': '4',
  '4A': '#4',
  '5d': 'b5',
  '5P': '5',
  '5A': '#5',
  '6m': 'b6',
  '6M': '6',
  '7m': 'b7',
  '7M': '7',
};

/**
 * ルート音とコードシンボルから、ピッチクラス → 度数ラベルのマップを返す。
 * Tonal.js の Chord.get().intervals を使うため、異名同音の問題が起きない。
 *
 * @example buildIntervalMap('C', 'M') → { C: 'R', E: '3', G: '5' }
 * @example buildIntervalMap('C', '7') → { C: 'R', E: '3', G: '5', Bb: 'b7' }
 */
export function buildIntervalMap(root: string, chordSymbol: string): Record<string, string> {
  const chord = Chord.get(root + chordSymbol);
  if (!chord.notes.length) return {};

  const map: Record<string, string> = {};
  chord.notes.forEach((note, i) => {
    const tonalInterval = chord.intervals[i];
    const label = TONAL_INTERVAL_TO_LABEL[tonalInterval] ?? tonalInterval;
    map[note] = label;
  });
  return map;
}

/** ルート音とコードシンボルから構成音（ピッチクラス）を返す */
export function getChordNotes(root: string, chordSymbol: string): string[] {
  return Chord.get(root + chordSymbol)?.notes ?? [];
}

/**
 * チューニング配列から指板マップを構築する。
 * tuning は表示順（高音弦 = index 0）で渡す。
 * @returns [弦index][フレット0..N] = ピッチクラス
 */
export function buildFretboard(tuning: string[]): string[][] {
  return tuning.map((openNote) =>
    Array.from({ length: NUM_FRETS + 1 }, (_, fret) => {
      const midi = (Note.midi(openNote) ?? 0) + fret;
      return Note.pitchClass(Note.fromMidi(midi));
    })
  );
}
