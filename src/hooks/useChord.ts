import { useMemo } from 'react';
import { getChordNotes, buildIntervalMap } from '../lib/musicTheory';
import type { ChordData } from '../types/music';

/**
 * ルート音とコードタイプから構成音・noteSet・intervalMap を返す。
 * intervalMap は Tonal.js の Chord.get().intervals を元に構築されるため
 * 異名同音（F vs E#）を正しく扱える。
 */
export function useChord(root: string, type: string): ChordData {
  return useMemo<ChordData>(() => {
    const notes = getChordNotes(root, type);
    const noteSet = new Set(notes);
    const intervalMap = buildIntervalMap(root, type);
    return { notes, noteSet, intervalMap };
  }, [root, type]);
}
