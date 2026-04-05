import { useState, useCallback, useEffect, useRef } from 'react';
import { Chord, Note, Interval } from 'tonal';
import { usePitchDetection } from './usePitchDetection';

export type InputMethod = 'tap' | 'mic';

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
  const [inputMethod, setInputMethod] = useState<InputMethod>('tap');

  // 連打防止用フラグ（レンダリングには影響させない）
  const processingRef = useRef(false);
  // usePitchDetection の onNoteDetected から currentQuestion を参照するための Ref
  const currentQuestionRef = useRef<Question | null>(null);
  const selectedRootRef = useRef(selectedRoot);
  const selectedTypeRef = useRef(selectedType);

  // Ref を常に最新値に同期
  useEffect(() => { currentQuestionRef.current = currentQuestion; }, [currentQuestion]);
  useEffect(() => { selectedRootRef.current = selectedRoot; }, [selectedRoot]);
  useEffect(() => { selectedTypeRef.current = selectedType; }, [selectedType]);

  // ルート/タイプが変わったら問題を再生成
  useEffect(() => {
    if (isQuizMode) {
      processingRef.current = false;
      setQuizClickState(null);
      setCurrentQuestion(makeQuestion(selectedRoot, selectedType));
    }
  }, [selectedRoot, selectedType, isQuizMode]);

  /** 正解/不正解の共通処理（handleQuizFret・マイク判定の両方から呼ばれる） */
  const handleAnswer = useCallback((isCorrect: boolean, clickState?: QuizClickState) => {
    processingRef.current = true;

    if (clickState) setQuizClickState(clickState);

    if (isCorrect) {
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
      setTimeout(() => {
        setQuizClickState(null);
        processingRef.current = false;
        setCurrentQuestion(makeQuestion(selectedRootRef.current, selectedTypeRef.current));
      }, 800);
    } else {
      setScore((s) => ({ ...s, total: s.total + 1 }));
      setTimeout(() => {
        setQuizClickState(null);
        processingRef.current = false;
      }, 600);
    }
  }, []);

  /** タップ用（既存のインターフェースを維持） */
  const handleQuizFret = useCallback(
    (stringIndex: number, fret: number) => {
      if (!currentQuestionRef.current || processingRef.current) return;

      const clickedNote = Note.pitchClass(
        Note.transpose(tuning[stringIndex], Interval.fromSemitones(fret))
      );
      const isCorrect = clickedNote === currentQuestionRef.current.targetNoteName;
      handleAnswer(isCorrect, { stringIndex, fret, result: isCorrect ? 'correct' : 'wrong' });
    },
    [tuning, handleAnswer]
  );

  /** マイク用コールバック（usePitchDetection の onNoteDetected に渡す） */
  const handleAnswerByNote = useCallback((noteClass: string) => {
    if (!currentQuestionRef.current || processingRef.current) return;
    const isCorrect = noteClass === currentQuestionRef.current.targetNoteName;
    handleAnswer(isCorrect);
  }, [handleAnswer]);

  const micState = usePitchDetection({
    enabled: isQuizMode && inputMethod === 'mic',
    onNoteDetected: handleAnswerByNote,
    confirmCount: 3,
    minRms: 0.015,
  });

  const startQuiz = useCallback(() => {
    setIsQuizMode(true);
    setScore({ correct: 0, total: 0 });
    setQuizClickState(null);
    processingRef.current = false;
    setCurrentQuestion(makeQuestion(selectedRoot, selectedType));
  }, [selectedRoot, selectedType]);

  const stopQuiz = useCallback(() => {
    setIsQuizMode(false);
    setInputMethod('tap'); // マイク解放のため tap に戻す
    setCurrentQuestion(null);
    setQuizClickState(null);
    processingRef.current = false;
  }, []);

  return {
    isQuizMode,
    currentQuestion,
    score,
    quizClickState,
    inputMethod,
    setInputMethod,
    micState,
    startQuiz,
    stopQuiz,
    handleQuizFret,
  };
}
