import { useState } from 'react';
import { Music, Menu, ChevronLeft } from 'lucide-react';
import type { DisplayMode } from './types/music';
import { DEFAULT_TUNING, STRING_LABELS } from './constants/tuning';
import Controls from './components/Controls';
import ChordPanel from './components/ChordPanel';
import Fretboard from './components/Fretboard';
import Legend from './components/Legend';

export default function App() {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedType, setSelectedType] = useState('M');
  // デフォルト: 度数表示
  const [displayMode, setDisplayMode] = useState<DisplayMode>('interval');
  const [activeFilter, setActiveFilter] = useState('all');
  const [panelOpen, setPanelOpen] = useState(true);
  const tuning = DEFAULT_TUNING;

  function handleRootChange(root: string) {
    setSelectedRoot(root);
    setActiveFilter('all');
  }

  function handleTypeChange(type: string) {
    setSelectedType(type);
    setActiveFilter('all');
  }

  return (
    <div className="app-layout">
      {/* ヘッダー */}
      <header className="app-header">
        <button
          className="panel-toggle-btn"
          onClick={() => setPanelOpen((v) => !v)}
          aria-label={panelOpen ? 'パネルを閉じる' : 'パネルを開く'}
        >
          <Menu size={16} />
        </button>
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
          <p
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              margin: '2px 0 0 0',
            }}
          >
            ベースコード学習アプリ
          </p>
        </div>
      </header>

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
        {/* サイドパネル (デスクトップ: サイドバー / モバイル: アコーディオン) */}
        <aside className={`app-panel${panelOpen ? ' open' : ''}`}>
          <div className="panel-inner">
            {/* デスクトップ専用: パネル内閉じるボタン */}
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
              onRootChange={handleRootChange}
              onTypeChange={handleTypeChange}
              onDisplayModeChange={setDisplayMode}
            />

            <ChordPanel
              selectedRoot={selectedRoot}
              selectedType={selectedType}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
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
              stringLabels={STRING_LABELS}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
