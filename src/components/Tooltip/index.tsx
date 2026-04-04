import { useState } from 'react';

interface Props {
  text: string;
}

export default function Tooltip({ text }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '50%',
          color: '#8892a4',
          cursor: 'pointer',
          width: '15px',
          height: '15px',
          fontSize: '9px',
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          marginLeft: '4px',
          flexShrink: 0,
        }}
        aria-label="ヘルプ"
      >
        ?
      </button>
      <span
        role="tooltip"
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          pointerEvents: 'none',
          width: '200px',
          backgroundColor: '#1e2a3a',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '11px',
          lineHeight: '1.6',
          color: '#e8e8e8',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.15s ease',
          whiteSpace: 'normal',
        }}
      >
        {text}
      </span>
    </span>
  );
}
