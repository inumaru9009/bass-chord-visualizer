import * as Tone from 'tone';
import { Note } from 'tonal';

let synth: Tone.PolySynth | null = null;

function getSynth(): Tone.PolySynth {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.5 },
    }).toDestination();
    synth.volume.value = -6;
  }
  return synth;
}

/**
 * 指定した弦・フレットの音を再生する。
 * @param stringIndex - 0 = 最高音弦（チューニング配列の先頭）
 * @param fret
 * @param tuning - 表示順のチューニング配列（例: ["G2","D2","A1","E1"]）
 */
export async function playNote(
  stringIndex: number,
  fret: number,
  tuning: string[]
): Promise<void> {
  await Tone.start();
  const openNote = tuning[stringIndex];
  const midi = (Note.midi(openNote) ?? 0) + fret;
  const noteName = Note.fromMidi(midi);
  getSynth().triggerAttackRelease(noteName, '2n');
}
