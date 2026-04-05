import { useEffect, useRef, useState, useCallback } from 'react';
import { PitchDetector } from 'pitchy';
import { Note } from 'tonal';

export type PitchDetectionOptions = {
  /** 検出した音名（ピッチクラス）を受け取るコールバック。例: 'E', 'G#', 'Bb' */
  onNoteDetected: (noteClass: string) => void;
  /** false のとき検出停止・マイク解放 */
  enabled: boolean;
  /** 無音と判断するRMSの下限（デフォルト: 0.015） */
  minRms?: number;
  /** 同音名が連続で何回来たら確定とするか（デフォルト: 3） */
  confirmCount?: number;
};

export type PitchDetectionResult = {
  isListening: boolean;
  /** リアルタイム表示用（確定前でも更新） */
  detectedNote: string | null;
  /** 'permission_denied' | 'not_supported' | null */
  error: string | null;
  /** 0〜1、UI表示用 */
  clarity: number;
};

export function usePitchDetection({
  onNoteDetected,
  enabled,
  minRms = 0.015,
  confirmCount = 3,
}: PitchDetectionOptions): PitchDetectionResult {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clarity, setClarity] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  /** 直近N個の音名を保持する確認バッファ */
  const confirmBufferRef = useRef<string[]>([]);
  /** 直前に onNoteDetected を発火した音名（連続発火防止） */
  const lastFiredRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    audioCtxRef.current = null;
    streamRef.current = null;
    animFrameRef.current = null;
    setIsListening(false);
    setDetectedNote(null);
    setClarity(0);
  }, []);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    let active = true;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('not_supported');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        // 8192サンプル（@44100Hz ≈ 186ms）: ベース低音（41Hz〜）の検出に必要な窓サイズ
        analyser.fftSize = 8192;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const buffer = new Float32Array(analyser.fftSize);
        const detector = PitchDetector.forFloat32Array(analyser.fftSize);

        setIsListening(true);
        setError(null);
        confirmBufferRef.current = [];
        lastFiredRef.current = null;

        function detect() {
          if (!active) return;

          analyser.getFloatTimeDomainData(buffer);

          // RMSで音量チェック — 無音・環境ノイズを除外
          let sumSq = 0;
          for (let i = 0; i < buffer.length; i++) sumSq += buffer[i] * buffer[i];
          const rms = Math.sqrt(sumSq / buffer.length);

          if (rms < minRms) {
            confirmBufferRef.current = [];
            animFrameRef.current = requestAnimationFrame(detect);
            return;
          }

          // McLeod Pitch Method でピッチ検出
          const [pitch, clarityValue] = detector.findPitch(buffer, ctx.sampleRate);
          setClarity(clarityValue);

          // clarity 0.9 未満 or ベース音域外（30Hz〜500Hz）は無視
          if (clarityValue < 0.9 || pitch < 30 || pitch > 500) {
            animFrameRef.current = requestAnimationFrame(detect);
            return;
          }

          // 周波数 → MIDI番号 → ピッチクラス（Tonal.js）
          const midi = Math.round(12 * Math.log2(pitch / 440) + 69);
          const noteClass = Note.pitchClass(Note.fromMidi(midi));

          setDetectedNote(noteClass);

          // 連続確認バッファに追加（直近 confirmCount 個を保持）
          const buf = confirmBufferRef.current;
          buf.push(noteClass);
          if (buf.length > confirmCount) buf.shift();

          // 全て同じ音名 & 直前の発火と違う場合のみコールバック発火
          if (
            buf.length === confirmCount &&
            buf.every((n) => n === noteClass) &&
            noteClass !== lastFiredRef.current
          ) {
            lastFiredRef.current = noteClass;
            confirmBufferRef.current = [];
            onNoteDetected(noteClass);
          }

          animFrameRef.current = requestAnimationFrame(detect);
        }

        detect();
      } catch {
        if (!active) return;
        setError('permission_denied');
        setIsListening(false);
      }
    }

    start();

    return () => {
      active = false;
      cleanup();
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isListening, detectedNote, error, clarity };
}
