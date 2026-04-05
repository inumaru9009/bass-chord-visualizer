import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { DisplayMode } from '../../types/music';
import type { TuningKey } from '../../constants/tuning';
import Controls from '../Controls';
import ChordPanel from '../ChordPanel';
import Fretboard from '../Fretboard';
import Legend from '../Legend';

interface Props {
  selectedRoot: string;
  selectedType: string;
  displayMode: DisplayMode;
  activeFilter: string;
  tuning: string[];
  stringLabels: string[];
  fretMin: number;
  fretMax: number;
  selectedTuning: TuningKey;
  selectedPosition: string;
  onRootChange: (root: string) => void;
  onTypeChange: (type: string) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  onTuningChange: (key: TuningKey) => void;
  onPositionChange: (id: string) => void;
  onFilterChange: (filter: string) => void;
}

export function ExploreMode({
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
  onFilterChange,
}: Props) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <>
      {/* モバイル: アコーディオントグルボタン */}
      <button
        className="accordion-toggle"
        onClick={() => setPanelOpen((v) => !v)}
        aria-expanded={panelOpen}
      >
        <span>{panelOpen ? '▲' : '▼'}</span>
        <span>{panelOpen ? 'コントロールを閉じる' : 'コントロールを開く'}</span>
      </button>

      <div className="app-body">
        {/* サイドパネル */}
        <aside className={`app-panel${panelOpen ? ' open' : ''}`}>
          <div className="panel-inner">
            {/* デスクトップ専用: 閉じるボタン */}
            <div className="panel-close-row">
              <button
                className="panel-close-btn"
                onClick={() => setPanelOpen(false)}
                aria-label="パネルを閉じる"
              >
                <ChevronLeft size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                {' '}閉じる
              </button>
            </div>

            <Controls
              selectedRoot={selectedRoot}
              selectedType={selectedType}
              displayMode={displayMode}
              selectedTuning={selectedTuning}
              selectedPosition={selectedPosition}
              isQuizMode={false}
              inputMethod="tap"
              showQuizControls={false}
              onRootChange={onRootChange}
              onTypeChange={onTypeChange}
              onDisplayModeChange={onDisplayModeChange}
              onTuningChange={onTuningChange}
              onPositionChange={onPositionChange}
              onQuizToggle={() => {}}
              onInputMethodChange={() => {}}
            />

            <ChordPanel
              selectedRoot={selectedRoot}
              selectedType={selectedType}
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
            />

            <Legend />
          </div>
        </aside>

        {/* 指板エリア */}
        <main className="app-fretboard">
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '10px',
              flexShrink: 0,
            }}
          >
            フレットをクリックすると音が鳴ります
          </p>

          <div
            style={{ overflowX: 'auto', overflowY: 'hidden', flex: 1 }}
            className="fretboard-scroll"
          >
            <Fretboard
              selectedRoot={selectedRoot}
              selectedType={selectedType}
              displayMode={displayMode}
              activeFilter={activeFilter}
              tuning={tuning}
              stringLabels={stringLabels}
              fretMin={fretMin}
              fretMax={fretMax}
            />
          </div>
        </main>
      </div>
    </>
  );
}
