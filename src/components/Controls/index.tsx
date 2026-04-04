import type { DisplayMode } from '../../types/music';
import { ROOT_NOTES, CHORD_TYPES } from '../../lib/musicTheory';

interface Props {
  selectedRoot: string;
  selectedType: string;
  displayMode: DisplayMode;
  onRootChange: (root: string) => void;
  onTypeChange: (type: string) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

export default function Controls({
  selectedRoot,
  selectedType,
  displayMode,
  onRootChange,
  onTypeChange,
  onDisplayModeChange,
}: Props) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">
      {/* ルート音 */}
      <div>
        <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
          ルート音
        </label>
        <div className="flex flex-wrap gap-2">
          {ROOT_NOTES.map((note) => (
            <button
              key={note}
              onClick={() => onRootChange(note)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                selectedRoot === note
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* コードタイプ */}
      <div>
        <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
          コードタイプ
        </label>
        <div className="flex flex-wrap gap-2">
          {CHORD_TYPES.map(({ label, symbol }) => (
            <button
              key={symbol}
              onClick={() => onTypeChange(symbol)}
              className={`px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
                selectedType === symbol
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 表示モード */}
      <div>
        <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
          表示モード
        </label>
        <div className="flex gap-2">
          {(['note', 'interval'] as DisplayMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onDisplayModeChange(mode)}
              className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                displayMode === mode
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {mode === 'note' ? '音名' : '度数'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
