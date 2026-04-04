import { useState } from 'react';
import type { DisplayMode } from '../../types/music';
import { ROOT_NOTES, CHORD_TYPES } from '../../lib/musicTheory';
import { TUNINGS, TUNING_LABELS, type TuningKey } from '../../constants/tuning';
import { useChordValidation } from '../../hooks/useChordValidation';
import Tooltip from '../Tooltip';

interface Props {
  selectedRoot: string;
  selectedType: string;
  displayMode: DisplayMode;
  selectedTuning: TuningKey;
  isQuizMode: boolean;
  onRootChange: (root: string) => void;
  onTypeChange: (type: string) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  onTuningChange: (key: TuningKey) => void;
  onQuizToggle: () => void;
}

export default function Controls({
  selectedRoot,
  selectedType,
  displayMode,
  selectedTuning,
  isQuizMode,
  onRootChange,
  onTypeChange,
  onDisplayModeChange,
  onTuningChange,
  onQuizToggle,
}: Props) {
  const { validRoots, validTypes } = useChordValidation(selectedRoot, selectedType);
  const [tuningOpen, setTuningOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">

      {/* チューニング（折りたたみ） */}
      <div>
        <button
          onClick={() => setTuningOpen((v) => !v)}
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>{tuningOpen ? '▼' : '▶'}</span>
          チューニング設定
          <Tooltip text="開放弦の音程を変えます。指板上の全音名・コード判定がリアルタイムで追従します。" />
        </button>
        <div
          style={{
            maxHeight: tuningOpen ? '120px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="flex flex-wrap gap-2 pt-2">
            {(Object.keys(TUNINGS) as TuningKey[]).map((key) => (
              <button
                key={key}
                onClick={() => onTuningChange(key)}
                className={`px-3 h-8 rounded-lg text-xs font-medium transition-colors ${
                  selectedTuning === key
                    ? 'text-black'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                style={
                  selectedTuning === key
                    ? { backgroundColor: 'var(--accent)' }
                    : {}
                }
              >
                {TUNING_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

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

      {/* クイズモード */}
      <div>
        <button
          onClick={onQuizToggle}
          className={`w-full h-10 rounded-xl text-sm font-bold transition-colors ${
            isQuizMode
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {isQuizMode ? '✅ クイズモード終了' : '🎯 クイズモード開始'}
        </button>
      </div>
    </div>
  );
}
