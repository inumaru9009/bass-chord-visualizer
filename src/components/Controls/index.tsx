import type { DisplayMode } from '../../types/music';
import { ROOT_NOTES, CHORD_TYPES } from '../../lib/musicTheory';
import { useChordValidation } from '../../hooks/useChordValidation';
import Tooltip from '../Tooltip';

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
  const { validRoots, validTypes } = useChordValidation(selectedRoot, selectedType);

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">
      {/* ルート音 */}
      <div>
        <label className="text-xs text-slate-400 uppercase tracking-wider flex items-center mb-2">
          ルート音
          <Tooltip text="コードの「土台」となる音。例えば「Cコード」ならCがルート音です。" />
        </label>
        <div className="flex flex-wrap gap-2">
          {ROOT_NOTES.map((note) => {
            const isValid = validRoots.includes(note);
            return (
              <button
                key={note}
                onClick={() => onRootChange(note)}
                disabled={!isValid}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  selectedRoot === note
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={!isValid ? { opacity: 0.3, pointerEvents: 'none', cursor: 'not-allowed' } : {}}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* コードタイプ */}
      <div>
        <label className="text-xs text-slate-400 uppercase tracking-wider flex items-center mb-2">
          コードタイプ
          <Tooltip text="音の積み重ね方のパターン。メジャー・マイナーなど雰囲気が変わります。" />
        </label>
        <div className="flex flex-wrap gap-2">
          {CHORD_TYPES.map(({ label, symbol }) => {
            const isValid = validTypes.includes(symbol);
            return (
              <button
                key={symbol}
                onClick={() => onTypeChange(symbol)}
                disabled={!isValid}
                className={`px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === symbol
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={!isValid ? { opacity: 0.3, pointerEvents: 'none', cursor: 'not-allowed' } : {}}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 表示モード */}
      <div>
        <label className="text-xs text-slate-400 uppercase tracking-wider flex items-center mb-2">
          表示モード
          <Tooltip text="指板上の音を「度数（R, 3, 5...）」か「音名（C, E, G...）」で表示を切り替えます。" />
        </label>
        <div className="flex gap-2">
          {(['interval', 'note'] as DisplayMode[]).map((mode) => (
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
