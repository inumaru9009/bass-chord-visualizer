import { useMemo } from 'react';
import type { DisplayMode } from '../../types/music';
import type { QuizClickState } from '../../hooks/useQuiz';
import StringRow from './StringRow';
import {
  FRET_WIDTH, STRING_HEIGHT, LEFT_MARGIN, TOP_MARGIN, BOTTOM_MARGIN,
  FRET_MARKERS, DOUBLE_MARKERS,
} from './layout';
import { NUM_FRETS } from '../../constants/tuning';
import { buildFretboard } from '../../lib/musicTheory';
import { useChord } from '../../hooks/useChord';

interface Props {
  selectedRoot: string;
  selectedType: string;
  displayMode: DisplayMode;
  activeFilter: string;
  tuning: string[];
  stringLabels: string[];
  /** 表示ポジションの最小フレット番号 */
  fretMin?: number;
  /** 表示ポジションの最大フレット番号 */
  fretMax?: number;
  /** クイズモード中は true（ドット非表示・全フレットクリック可） */
  isQuizMode?: boolean;
  /** クイズモード中のフレットクリック通知 */
  onQuizFret?: (stringIndex: number, fret: number) => void;
  /** クイズフィードバック（アニメーション表示用） */
  quizClickState?: QuizClickState | null;
}

export default function Fretboard({
  selectedRoot,
  selectedType,
  displayMode,
  activeFilter,
  tuning,
  stringLabels,
  fretMin = 0,
  fretMax = NUM_FRETS,
  isQuizMode = false,
  onQuizFret,
  quizClickState,
}: Props) {
  const fretboard = useMemo(() => buildFretboard(tuning), [tuning]);
  const { noteSet, intervalMap } = useChord(selectedRoot, selectedType);

  const numStrings = tuning.length;
  const svgWidth = LEFT_MARGIN + (NUM_FRETS + 1) * FRET_WIDTH + 4;
  const svgHeight = TOP_MARGIN + numStrings * STRING_HEIGHT + BOTTOM_MARGIN;

  /** フレット番号をSVG左端X座標に変換（フレット区間の左境界） */
  function fretToX(fret: number): number {
    return fret === 0 ? 0 : LEFT_MARGIN + (fret - 1) * FRET_WIDTH;
  }

  const isFiltered = fretMin !== 0 || fretMax !== NUM_FRETS;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }} className="fretboard-scroll">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        preserveAspectRatio="xMinYMid meet"
        style={{ display: 'block', maxWidth: svgWidth, height: 'auto' }}
      >
        {/* フレット番号 */}
        {Array.from({ length: NUM_FRETS }, (_, i) => {
          const fret = i + 1;
          if (!FRET_MARKERS.has(fret)) return null;
          return (
            <text
              key={fret}
              x={LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH}
              y={10}
              dominantBaseline="central"
              textAnchor="middle"
              fill="#475569"
              fontSize={10}
              fontFamily="system-ui, sans-serif"
            >
              {fret}
            </text>
          );
        })}

        {/* ナット */}
        <line
          x1={LEFT_MARGIN} y1={TOP_MARGIN}
          x2={LEFT_MARGIN} y2={TOP_MARGIN + numStrings * STRING_HEIGHT}
          stroke="#cbd5e1" strokeWidth={3}
        />

        {/* フレット縦線 */}
        {Array.from({ length: NUM_FRETS }, (_, i) => {
          const fret = i + 1;
          const x = LEFT_MARGIN + fret * FRET_WIDTH;
          return (
            <line
              key={fret}
              x1={x} y1={TOP_MARGIN}
              x2={x} y2={TOP_MARGIN + numStrings * STRING_HEIGHT}
              stroke="#334155" strokeWidth={1}
            />
          );
        })}

        {/* インレイドット（弦より背面） */}
        {Array.from({ length: NUM_FRETS }, (_, i) => {
          const fret = i + 1;
          if (!FRET_MARKERS.has(fret)) return null;
          const x = LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH;
          const midY = TOP_MARGIN + (numStrings * STRING_HEIGHT) / 2;

          if (DOUBLE_MARKERS.has(fret)) {
            const offset = STRING_HEIGHT * 0.8;
            return (
              <g key={fret}>
                <circle cx={x} cy={midY - offset} r={5} fill="#b8964a" opacity={0.7} />
                <circle cx={x} cy={midY + offset} r={5} fill="#b8964a" opacity={0.7} />
              </g>
            );
          }
          return <circle key={fret} cx={x} cy={midY} r={5} fill="#b8964a" opacity={0.7} />;
        })}

        {/* 各弦 */}
        {fretboard.map((notes, sIdx) => (
          <StringRow
            key={sIdx}
            stringIndex={sIdx}
            label={stringLabels[sIdx]}
            notes={notes}
            chordNoteSet={noteSet}
            intervalMap={intervalMap}
            displayMode={displayMode}
            activeFilter={activeFilter}
            tuning={tuning}
            isQuizMode={isQuizMode}
            onQuizFret={onQuizFret}
            quizFeedback={
              quizClickState?.stringIndex === sIdx
                ? { fret: quizClickState.fret, result: quizClickState.result }
                : null
            }
          />
        ))}

        {/* ポジションフェードオーバーレイ */}
        {isFiltered && (
          <>
            {/* 左側フェード */}
            {fretMin > 0 && (
              <rect
                x={0}
                y={0}
                width={fretToX(fretMin)}
                height={svgHeight}
                fill="rgba(15,17,23,0.82)"
                style={{ pointerEvents: 'none' }}
              />
            )}
            {/* 右側フェード */}
            {fretMax < NUM_FRETS && (
              <rect
                x={fretToX(fretMax + 1)}
                y={0}
                width={svgWidth - fretToX(fretMax + 1)}
                height={svgHeight}
                fill="rgba(15,17,23,0.82)"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </>
        )}
      </svg>
    </div>
  );
}
