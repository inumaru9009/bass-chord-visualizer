import type { DisplayMode } from '../../types/music';
import NoteDot from './NoteDot';
import { FRET_WIDTH, LEFT_MARGIN, TOP_MARGIN, STRING_HEIGHT, DOT_RADIUS } from './layout';
import { NUM_FRETS } from '../../constants/tuning';
import { playNote } from '../../lib/audio';

interface Props {
  stringIndex: number;
  label: string;
  notes: string[];                       // [フレット0..N] のピッチクラス
  chordNoteSet: Set<string>;
  intervalMap: Record<string, string>;   // ピッチクラス → 度数ラベル（useChord 由来）
  displayMode: DisplayMode;
  activeFilter: string;
  tuning: string[];
}

export default function StringRow({
  stringIndex,
  label,
  notes,
  chordNoteSet,
  intervalMap,
  displayMode,
  activeFilter,
  tuning,
}: Props) {
  const y = TOP_MARGIN + stringIndex * STRING_HEIGHT + STRING_HEIGHT / 2;
  // 1弦(G,index 0)=1.2px → 4弦(E,index 3)=3.5px に差別化
  const STRING_THICKNESSES = [1.2, 1.8, 2.5, 3.5];
  const stringThickness = STRING_THICKNESSES[stringIndex] ?? 1.5;

  return (
    <g>
      {/* 弦ラベル */}
      <text
        x={LEFT_MARGIN - 6}
        y={y}
        dominantBaseline="central"
        textAnchor="end"
        fill="#94a3b8"
        fontSize={11}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>

      {/* 弦ライン */}
      <line
        x1={LEFT_MARGIN}
        y1={y}
        x2={LEFT_MARGIN + (NUM_FRETS + 1) * FRET_WIDTH}
        y2={y}
        stroke="#64748b"
        strokeWidth={stringThickness}
      />

      {/* コードトーンのドット */}
      {notes.map((noteName, fret) => {
        if (!chordNoteSet.has(noteName)) return null;

        // intervalMap は Tonal.js の Chord.get().intervals から構築済み
        const intervalLabel = intervalMap[noteName];
        if (!intervalLabel) return null;

        if (activeFilter !== 'all' && intervalLabel !== activeFilter) return null;

        const cx =
          fret === 0
            ? LEFT_MARGIN + FRET_WIDTH * 0.25
            : LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH;

        return (
          <NoteDot
            key={fret}
            cx={cx}
            cy={y}
            intervalLabel={intervalLabel}
            noteName={noteName}
            displayMode={displayMode}
            onClick={() => playNote(stringIndex, fret, tuning)}
          />
        );
      })}

      {/* 非コードトーンのヒットエリア（クリックで音を鳴らす） */}
      {notes.map((noteName, fret) => {
        if (chordNoteSet.has(noteName)) return null;

        const cx =
          fret === 0
            ? LEFT_MARGIN + FRET_WIDTH * 0.25
            : LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH;

        return (
          <circle
            key={`hit-${fret}`}
            cx={cx}
            cy={y}
            r={DOT_RADIUS}
            fill="transparent"
            style={{ cursor: 'pointer' }}
            onClick={() => playNote(stringIndex, fret, tuning)}
          >
            <title>{noteName}</title>
          </circle>
        );
      })}
    </g>
  );
}
