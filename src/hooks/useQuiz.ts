import { useState, useCallback, useEffect, useRef } from 'react';
import { Chord, Note, Interval } from 'tonal';

export interface Question {
  targetInterval: string;   // Tonal.js 区間記法 ('1P', '3M', ...)
  targetNoteName: string;   // ピッチクラス ('C', 'G#', ...)
  questionText: string;     // 表示用日本語テキスト
}

export interface QuizClickState {
  stringIndex: number;
  fret: number;
  result: 'correct' | 'wrong';
}

const INTERVAL_TO_JAPANESE: Record<string, string> = {
  '1P': 'ルート（1度）',
  '2m': '短2度',
  '2M': '長2度',
  '3m': '短3度',
  '3M': '長3度',
  '4P': '完全4度',
  '4A': '増4度',
  '5d': '減5度',
  '5P': '完全5度',
  '5A': '増5度',
  '6m': '短6度',
  '6M': '長6度',
  '7m': '短7度',
  '7M': '長7度',
};

function makeQuestion(root: string, chordType: string): Question {
  const chord = Chord.get(`${root}${chordType}`);
  const intervals = chord.intervals.length ? chord.intervals : ['1P'];
  const idx = Math.floor(Math.random() * intervals.length);
  const targetInterval = intervals[idx];
  const targetNote = Note.transpose(root, targetInterval);
  const targetNoteName = Note.pitchClass(targetNote);

  const useIntervalForm = Math.random() < 0.5;
  const questionText = useIntervalForm
    ? `${root}${chordType} の「${INTERVAL_TO_JAPANESE[targetInterval] ?? targetInterval}」を押さえよう`
    : `${root}${chordType} の「${targetNoteName}音」を押さえよう`;

  return { targetInterval, targetNoteName, questionText };
}

export function useQuiz(selectedRoot: string, selectedType: string, tuning: string[]) {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [quizClickState, setQuizClickState] = useState<QuizClickState | null>(null);

  // 連打防止用フラグ（レンダリングには影響させない）
  const processingRef = useRef(false);

  // ルート/タイプが変わったら問題を再生成
  useEffect(() => {
    if (isQuizMode) {
      processingRef.current = false;
      setQuizClickState(null);
      setCurrentQuestion(makeQuestion(selectedRoot, selectedType));
    }
  }, [selectedRoot, selectedType, isQuizMode]);

  const startQuiz = useCallback(() => {
    setIsQuizMode(true);
    setScore({ correct: 0, total: 0 });
    setQuizClickState(null);
    processingRef.current = false;
    setCurrentQuestion(makeQuestion(selectedRoot, selectedType));
  }, [selectedRoot, selectedType]);

  const stopQuiz = useCallback(() => {
    setIsQuizMode(false);
    setCurrentQuestion(null);
    setQuizClickState(null);
    processingRef.current = false;
  }, []);

  const handleQuizFret = useCallback(
    (stringIndex: number, fret: number) => {
      if (!currentQuestion || processingRef.current) return;
      processingRef.current = true;

      const clickedNote = Note.pitchClass(
        Note.transpose(tuning[stringIndex], Interval.fromSemitones(fret))
      );
      const isCorrect = clickedNote === currentQuestion.targetNoteName;

      setQuizClickState({ stringIndex, fret, result: isCorrect ? 'correct' : 'wrong' });

      if (isCorrect) {
        setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
        // 正解: 800ms 後に次の問題へ
        setTimeout(() => {
          setQuizClickState(null);
          processingRef.current = false;
          setCurrentQuestion(makeQuestion(selectedRoot, selectedType));
        }, 800);
      } else {
        setScore((s) => ({ ...s, total: s.total + 1 }));
        // 不正解: 600ms 後にリセット（同問題継続）
        setTimeout(() => {
          setQuizClickState(null);
          processingRef.current = false;
        }, 600);
      }
    },
    [currentQuestion, tuning, selectedRoot, selectedType]
  );

  return {
    isQuizMode,
    currentQuestion,
    score,
    quizClickState,
    startQuiz,
    stopQuiz,
    handleQuizFret,
  };
}
