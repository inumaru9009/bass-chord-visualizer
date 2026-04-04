import { getDotStyle, isTriadTone } from '../../constants/intervalColors';

const ENTRIES = [
  // トライアド
  { label: 'R',  desc: 'ルート' },
  { label: '3',  desc: '長3度' },
  { label: 'b3', desc: '短3度' },
  { label: '5',  desc: '完全5度' },
  { label: 'b5', desc: '減5度' },
  { label: '#5', desc: '増5度' },
  // 拡張音
  { label: 'b7', desc: '短7度' },
  { label: '7',  desc: '長7度' },
  { label: '4',  desc: '完全4度' },
  { label: '2',  desc: '長2度' },
  { label: '6',  desc: '長6度' },
] as const;

export default function Legend() {
  const triadEntries = ENTRIES.filter((e) => isTriadTone(e.label));
  const extensionEntries = ENTRIES.filter((e) => !isTriadTone(e.label));

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      {/* トライアド */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
          トライアド（ルート・3度・5度）
        </p>
        <div className="flex flex-wrap gap-3">
          {triadEntries.map(({ label, desc }) => {
            const style = getDotStyle(label);
            return (
              <div key={label} className="flex items-center gap-2">
                <svg width="22" height="22" aria-hidden="true">
                  <circle cx="11" cy="11" r="9" fill="none" stroke={style.fill} strokeWidth="1.5" opacity={0.4} />
                  <circle cx="11" cy="11" r="8" fill={style.fill} stroke={style.stroke} strokeWidth="1.5" />
                </svg>
                <span className="text-xs text-slate-300">
                  <span className="font-bold text-white">{label}</span>
                  {' '}— {desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 拡張音 */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          拡張音（7度・他）
        </p>
        <div className="flex flex-wrap gap-3">
          {extensionEntries.map(({ label, desc }) => {
            const style = getDotStyle(label);
            return (
              <div key={label} className="flex items-center gap-2">
                <svg width="22" height="22" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" fill={style.fill} stroke={style.stroke} strokeWidth="1" opacity={0.65} />
                </svg>
                <span className="text-xs text-slate-500">
                  <span className="font-medium text-slate-400">{label}</span>
                  {' '}— {desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
