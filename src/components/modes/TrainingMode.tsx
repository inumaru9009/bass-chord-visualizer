import type { DisplayMode } from '../../types/music';
import type { TuningKey } from '../../constants/tuning';
import type { InputMethod, Question, QuizClickState } from '../../hooks/useQuiz';
import type { PitchDetectionResult } from '../../hooks/usePitchDetection';
import QuizDisplay from '../QuizDisplay';
import Fretboard from '../Fretboard';
import Controls from '../Controls';

interface Props {
  // ── useQuiz から来るもの ──────────────────────────────────
  isQuizMode: boolean;
  currentQuestion: Question | null;
  score: { correct: number; total: number };
  quizClickState: QuizClickState | null;
  startQuiz: () => void;
  stopQuiz: () => void;
  handleQuizFret: (stringIndex: number, fret: number) => void;
  inputMethod: InputMethod;
  setInputMethod: (m: InputMethod) => void;
  micState: PitchDetectionResult;

  // ── Fretboard / Controls 共通 ─────────────────────────────
  selectedRoot: string;
  selectedType: string;
  displayMode: DisplayMode;
  activeFilter: string;
  tuning: string[];
  stringLabels: string[];
  fretMin: number;
  fretMax: number;

  // ── Controls 専用 ─────────────────────────────────────────
  selectedTuning: TuningKey;
  selectedPosition: string;
  onRootChange: (root: string) => void;
  onTypeChange: (type: string) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  onTuningChange: (key: TuningKey) => void;
  onPositionChange: (id: string) => void;
}

export function TrainingMode({
  isQuizMode,
  currentQuestion,
  score,
  quizClickState,
  startQuiz,
  stopQuiz,
  handleQuizFret,
  inputMethod,
  setInputMethod,
  micState,
  selectedRoot,
  selectedType,
  displayMode,
  activeFilter,
  tuning,
  stringLabels,
  fretMin,
  fretMax,
  selectedTuning,
  selectedPosition,
  onRootChange,
  onTypeChange,
  onDisplayModeChange,
  onTuningChange,
  onPositionChange,
}: Props) {
  function handleQuizToggle() {
    if (isQuizMode) {
      stopQuiz();
    } else {
      startQuiz();
    }
  }

  return (
    <div className="training-mode">

      {/* 上部: 問題表示エリア（クイズ未開始時はプロンプト） */}
      <div className="training-question-area">
        {isQuizMode ? (
          <QuizDisplay
            question={currentQuestion}
            score={score}
            inputMethod={inputMethod}
            micState={micState}
          />
        ) : (
          <div className="training-start-prompt">
            <p>コードを選んでクイズを開始してください</p>
          </div>
        )}
      </div>

      {/* 中央: 指板（クイズモード時はタップ判定有効） */}
      <div className="training-fretboard-area">
        <Fretboard
          selectedRoot={selectedRoot}
          selectedType={selectedType}
          displayMode={displayMode}
          activeFilter={activeFilter}
          tuning={tuning}
          stringLabels={stringLabels}
          fretMin={fretMin}
          fretMax={fretMax}
          isQuizMode={isQuizMode}
          onQuizFret={handleQuizFret}
          quizClickState={quizClickState}
        />
      </div>

      {/* 下部: コントロール（クイズ開始/終了・入力切替含む） */}
      <div className="training-controls-area">
        <Controls
          selectedRoot={selectedRoot}
          selectedType={selectedType}
          displayMode={displayMode}
          selectedTuning={selectedTuning}
          selectedPosition={selectedPosition}
          isQuizMode={isQuizMode}
          inputMethod={inputMethod}
          onRootChange={onRootChange}
          onTypeChange={onTypeChange}
          onDisplayModeChange={onDisplayModeChange}
          onTuningChange={onTuningChange}
          onPositionChange={onPositionChange}
          onQuizToggle={handleQuizToggle}
          onInputMethodChange={setInputMethod}
        />
      </div>

    </div>
  );
}
