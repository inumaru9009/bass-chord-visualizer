import type { Question } from '../../hooks/useQuiz';

interface Props {
  question: Question | null;
  score: { correct: number; total: number };
}

export default function QuizDisplay({ question, score }: Props) {
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
          フレットをクリックして答えよう
        </span>
      </div>
    </div>
  );
}
