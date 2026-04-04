import { useMemo } from 'react';
import { Chord } from 'tonal';
import { ROOT_NOTES, CHORD_TYPES } from '../lib/musicTheory';

/**
 * 選択中のルートとコードタイプに対して、有効なルート一覧・コードタイプ一覧を返す。
 * Tonal.js の Chord.get() でノート数が 0 のものを無効とみなす。
 */
export function useChordValidation(selectedRoot: string, selectedType: string) {
  const validRoots = useMemo(() => {
    return (ROOT_NOTES as readonly string[]).filter((root) => {
      const chord = Chord.get(`${root}${selectedType}`);
      return chord.notes.length > 0;
    });
  }, [selectedType]);

  const validTypes = useMemo(() => {
    return CHORD_TYPES.filter(({ symbol }) => {
      const chord = Chord.get(`${selectedRoot}${symbol}`);
      return chord.notes.length > 0;
    }).map(({ symbol }) => symbol);
  }, [selectedRoot]);

  return { validRoots, validTypes };
}
