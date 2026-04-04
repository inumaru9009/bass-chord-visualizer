import type { DisplayMode } from '../../types/music';
import { getDotStyle, isTriadTone } from '../../constants/intervalColors';
import { DOT_RADIUS } from './layout';

interface Props {
  cx: number;
  cy: number;
  intervalLabel: string;
  noteName: string;
  displayMode: DisplayMode;
  onClick: () => void;
}

export default function NoteDot({ cx, cy, intervalLabel, noteName, displayMode, onClick }: Props) {
  const style = getDotStyle(intervalLabel);
  const triad = isTriadTone(intervalLabel);
  const label = displayMode === 'interval' ? intervalLabel : noteName;

  // トライアド音はフルサイズ、拡張音（7度など）は 75% サイズで視覚的に区別
  const r = triad ? DOT_RADIUS : DOT_RADIUS * 0.75;
  const fontSize = label.length > 2 ? (triad ? 8 : 7) : (triad ? 11 : 9);

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`${noteName} (${intervalLabel})`}
    >
      {/* トライアド音には外側にリングを追加して強調 */}
      {triad && (
        <circle
          cx={cx}
          cy={cy}
          r={r + 3}
          fill="none"
          stroke={style.fill}
          strokeWidth={1.5}
          opacity={0.4}
        />
      )}

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={triad ? 1.5 : 1}
        opacity={triad ? 1 : 0.65}
        className="transition-all duration-100 hover:opacity-90"
      />

      <text
        x={cx}
        y={cy}
        dominantBaseline="central"
        textAnchor="middle"
        fill={style.text}
        fontSize={fontSize}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        opacity={triad ? 1 : 0.8}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>
    </g>
  );
}
