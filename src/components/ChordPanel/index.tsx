import { useChord } from '../../hooks/useChord';
import { getDotStyle } from '../../constants/intervalColors';

interface Props {
  selectedRoot: string;
  selectedType: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ChordPanel({
  selectedRoot,
  selectedType,
  activeFilter,
  onFilterChange,
}: Props) {
  const { notes, intervalMap } = useChord(selectedRoot, selectedType);

  const intervals = notes.map((note) => ({ note, label: intervalMap[note] ?? '' }));
  const filterOptions = ['all', ...intervals.map((i) => i.label)];

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <div>
        <h2 className="text-xl font-bold text-white">
          {selectedRoot}{selectedType} コード
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          構成音: {notes.join(' · ')}
        </p>
      </div>

      {/* 構成音バッジ */}
      <div className="flex flex-wrap gap-2">
        {intervals.map(({ note, label }) => {
          const style = getDotStyle(label);
          return (
            <div
              key={note}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
              style={{ backgroundColor: style.fill + '33', border: `1px solid ${style.fill}` }}
            >
              <span className="text-slate-200 text-sm font-medium">{note}</span>
              <span className="text-slate-500 text-xs">=</span>
              <span className="text-sm font-bold" style={{ color: style.fill }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* フィルター */}
      <div>
        <p className="text-xs text-slate-500 mb-2">強調する度数</p>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onFilterChange(opt)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeFilter === opt
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {opt === 'all' ? 'すべて' : opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
