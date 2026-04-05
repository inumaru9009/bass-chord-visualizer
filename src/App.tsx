import { useState } from 'react';
import { Music } from 'lucide-react';
import type { DisplayMode } from './types/music';
import {
  TUNINGS, TUNING_LABELS, STRING_LABELS_BY_TUNING,
  type TuningKey,
} from './constants/tuning';
import { useQuiz } from './hooks/useQuiz';
import { POSITIONS } from './utils/positions';
import { ExploreMode } from './components/modes/ExploreMode';
import { TrainingMode } from './components/modes/TrainingMode';

type AppMode = 'explore' | 'training';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('explore');

  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedType, setSelectedType] = useState('M');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('interval');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTuning, setSelectedTuning] = useState<TuningKey>('standard');
  const [selectedPosition, setSelectedPosition] = useState('all');

  const tuning = [...TUNINGS[selectedTuning]];
  const stringLabels = [...STRING_LABELS_BY_TUNING[selectedTuning]];
  const currentPos = POSITIONS.find((p) => p.id === selectedPosition) ?? POSITIONS[0];

  const {
    isQuizMode,
    currentQuestion,
    score,
    quizClickState,
    inputMethod,
    setInputMethod,
    micState,
    startQuiz,
    stopQuiz,
    handleQuizFret,
  } = useQuiz(selectedRoot, selectedType, tuning);

  function handleRootChange(root: string) {
    setSelectedRoot(root);
    setActiveFilter('all');
  }

  function handleTypeChange(type: string) {
    setSelectedType(type);
    setActiveFilter('all');
  }

  function handleModeChange(mode: AppMode) {
    setAppMode(mode);
    // トレーニングタブから離れるときクイズを停止
    if (mode === 'explore' && isQuizMode) stopQuiz();
  }

  return (
    <div className={`app-layout mode-${appMode}`}>
      {/* ヘッダー */}
      <header className="app-header">
        <Music size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: 1.1,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Bass Chord Visualizer
          </h1>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            ベースコード学習アプリ
            {isQuizMode && (
              <span style={{ marginLeft: '8px', color: 'var(--quiz-correct)', fontWeight: 'bold' }}>
                🎯 クイズモード中
              </span>
            )}
          </p>
        </div>
        {/* チューニング表示 */}
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '3px 8px',
            flexShrink: 0,
          }}
        >
          {TUNING_LABELS[selectedTuning]}
        </span>
      </header>

      {/* モード切替タブ */}
      <div className="mode-tabs">
        <button
          className={`mode-tab${appMode === 'explore' ? ' active' : ''}`}
          onClick={() => handleModeChange('explore')}
        >
          🔍 コードを探す
        </button>
        <button
          className={`mode-tab${appMode === 'training' ? ' active' : ''}`}
          onClick={() => handleModeChange('training')}
        >
          🎯 楽器でトレーニング
        </button>
      </div>

      {/* モード本体 */}
      {appMode === 'explore' ? (
        <ExploreMode
          selectedRoot={selectedRoot}
          selectedType={selectedType}
          displayMode={displayMode}
          activeFilter={activeFilter}
          tuning={tuning}
          stringLabels={stringLabels}
          fretMin={currentPos.fretMin}
          fretMax={currentPos.fretMax}
          selectedTuning={selectedTuning}
          selectedPosition={selectedPosition}
          onRootChange={handleRootChange}
          onTypeChange={handleTypeChange}
          onDisplayModeChange={setDisplayMode}
          onTuningChange={setSelectedTuning}
          onPositionChange={setSelectedPosition}
          onFilterChange={setActiveFilter}
        />
      ) : (
        <TrainingMode
          isQuizMode={isQuizMode}
          currentQuestion={currentQuestion}
          score={score}
          quizClickState={quizClickState}
          startQuiz={startQuiz}
          stopQuiz={stopQuiz}
          handleQuizFret={handleQuizFret}
          inputMethod={inputMethod}
          setInputMethod={setInputMethod}
          micState={micState}
          selectedRoot={selectedRoot}
          selectedType={selectedType}
          displayMode={displayMode}
          activeFilter={activeFilter}
          tuning={tuning}
          stringLabels={stringLabels}
          fretMin={currentPos.fretMin}
          fretMax={currentPos.fretMax}
          selectedTuning={selectedTuning}
          selectedPosition={selectedPosition}
          onRootChange={handleRootChange}
          onTypeChange={handleTypeChange}
          onDisplayModeChange={setDisplayMode}
          onTuningChange={setSelectedTuning}
          onPositionChange={setSelectedPosition}
        />
      )}
    </div>
  );
}
