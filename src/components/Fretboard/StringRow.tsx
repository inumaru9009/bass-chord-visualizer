import type { DisplayMode } from '../../types/music';
import NoteDot from './NoteDot';
import { FRET_WIDTH, LEFT_MARGIN, TOP_MARGIN, STRING_HEIGHT, DOT_RADIUS } from './layout';
import { NUM_FRETS } from '../../constants/tuning';
import { playNote } from '../../lib/audio';

/** タップ判定エリアの上下拡張量（モバイルでのタップ精度改善） */
const HIT_PADDING = 12;

interface QuizFeedback {
  fret: number;
  result: 'correct' | 'wrong';
}

interface Props {
  stringIndex: number;
  label: string;
  notes: string[];                       // [フレット0..N] のピッチクラス
  chordNoteSet: Set<string>;
  intervalMap: Record<string, string>;   // ピッチクラス → 度数ラベル
  displayMode: DisplayMode;
  activeFilter: string;
  tuning: string[];
  /** クイズモード中は true */
  isQuizMode?: boolean;
  /** クイズモード中のフレットクリック通知 */
  onQuizFret?: (stringIndex: number, fret: number) => void;
  /** このStringRowに該当するクイズフィードバック */
  quizFeedback?: QuizFeedback | null;
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
  isQuizMode = false,
  onQuizFret,
  quizFeedback,
}: Props) {
  const y = TOP_MARGIN + stringIndex * STRING_HEIGHT + STRING_HEIGHT / 2;
  // 1弦(G,index 0)=1.2px → 4弦(E,index 3)=3.5px
  const STRING_THICKNESSES = [1.2, 1.8, 2.5, 3.5];
  const stringThickness = STRING_THICKNESSES[stringIndex] ?? 1.5;

  /** フレットの中心X座標を返す */
  function fretCx(fret: number): number {
    return fret === 0
      ? LEFT_MARGIN + FRET_WIDTH * 0.25
      : LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH;
  }

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

      {/* ── クイズモード ───────────────────────────────────── */}
      {isQuizMode && notes.map((_, fret) => {
        const cx = fretCx(fret);
        const isFeedbackHere = quizFeedback?.fret === fret;
        // フレット左端X（rect の x 基点）
        const rx = cx - FRET_WIDTH / 2;

        return (
          <g key={fret}>
            {/* フィードバックドット */}
            {isFeedbackHere && (
              <circle
                cx={cx}
                cy={y}
                r={DOT_RADIUS}
                fill={
                  quizFeedback?.result === 'correct'
                    ? 'var(--quiz-correct)'
                    : 'var(--quiz-wrong)'
                }
                className={
                  quizFeedback?.result === 'correct' ? 'dot-correct' : 'dot-wrong'
                }
              />
            )}
            {/* タップ判定エリア（上下 HIT_PADDING 拡張） */}
            <rect
              x={rx}
              y={y - STRING_HEIGHT / 2 - HIT_PADDING}
              width={FRET_WIDTH}
              height={STRING_HEIGHT + HIT_PADDING * 2}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                playNote(stringIndex, fret, tuning);
                onQuizFret?.(stringIndex, fret);
              }}
            >
              <title>{notes[fret]}</title>
            </rect>
          </g>
        );
      })}

      {/* ── 通常モード ─────────────────────────────────────── */}
      {!isQuizMode && (
        <>
          {/* コードトーンのドット */}
          {notes.map((noteName, fret) => {
            if (!chordNoteSet.has(noteName)) return null;
            const intervalLabel = intervalMap[noteName];
            if (!intervalLabel) return null;
            if (activeFilter !== 'all' && intervalLabel !== activeFilter) return null;

            return (
              <NoteDot
                key={fret}
                cx={fretCx(fret)}
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
            const cx = fretCx(fret);
            return (
              <rect
                key={`hit-${fret}`}
                x={cx - FRET_WIDTH / 2}
                y={y - STRING_HEIGHT / 2 - HIT_PADDING}
                width={FRET_WIDTH}
                height={STRING_HEIGHT + HIT_PADDING * 2}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => playNote(stringIndex, fret, tuning)}
              >
                <title>{noteName}</title>
              </rect>
            );
          })}
        </>
      )}
    </g>
  );
}
