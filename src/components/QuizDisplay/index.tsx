import type { Question, InputMethod } from '../../hooks/useQuiz';
import type { PitchDetectionResult } from '../../hooks/usePitchDetection';

interface Props {
  question: Question | null;
  score: { correct: number; total: number };
  inputMethod: InputMethod;
  micState: PitchDetectionResult;
}

export default function QuizDisplay({ question, score, inputMethod, micState }: Props) {
  const accuracy =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '12px',
        flexShrink: 0,
      }}
    >
      {/* 問題文 */}
      <p
        style={{
          fontSize: '15px',
          fontWeight: 'bold',
          color: 'var(--accent)',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        🎯 {question?.questionText ?? '問題を生成中...'}
      </p>

      {/* スコア */}
      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          ✅ {score.correct} / {score.total}
          {accuracy !== null && (
            <span style={{ marginLeft: '6px', color: accuracy >= 70 ? '#22c55e' : '#f59e0b' }}>
              ({accuracy}%)
            </span>
          )}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {inputMethod === 'mic' ? '🎙️ ベースで弾いて答えよう' : 'フレットをクリックして答えよう'}
        </span>
      </div>

      {/* マイクインジケーター（マイクモード時のみ） */}
      {inputMethod === 'mic' && (
        <div className="mic-indicator">
          {micState.error === 'permission_denied' && (
            <p className="mic-error">⚠️ マイクの許可が必要です</p>
          )}
          {micState.error === 'not_supported' && (
            <p className="mic-error">⚠️ このブラウザはマイク非対応です</p>
          )}
          {!micState.error && (
            <>
              <span className={`mic-status${micState.isListening ? ' listening' : ''}`}>
                {micState.isListening ? '🎙️ 聴いています…' : '⏳ 起動中…'}
              </span>
              {micState.detectedNote && (
                <span className="mic-detected-note">{micState.detectedNote}</span>
              )}
              {/* clarityバー: 低音域では0.9以上が正常 */}
              <div className="mic-clarity-bar">
                <div
                  className="mic-clarity-fill"
                  style={{ width: `${micState.clarity * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
