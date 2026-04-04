import { useState } from 'react';
import { Music } from 'lucide-react';
import type { DisplayMode } from './types/music';
import { DEFAULT_TUNING, STRING_LABELS } from './constants/tuning';
import Controls from './components/Controls';
import ChordPanel from './components/ChordPanel';
import Fretboard from './components/Fretboard';
import Legend from './components/Legend';

export default function App() {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedType, setSelectedType] = useState('M');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('note');
  const [activeFilter, setActiveFilter] = useState('all');
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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 pb-1">
          <Music className="text-indigo-400" size={26} />
          <div>
            <h1 className="text-2xl font-bold text-white leading-none">
              Bass Chord Visualizer
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">ベースコード学習アプリ</p>
          </div>
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

        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-3">
            フレットをクリックすると音が鳴ります
          </p>
          <Fretboard
            selectedRoot={selectedRoot}
            selectedType={selectedType}
            displayMode={displayMode}
            activeFilter={activeFilter}
            tuning={tuning}
            stringLabels={STRING_LABELS}
          />
        </div>

        <Legend />
      </div>
    </div>
  );
}
