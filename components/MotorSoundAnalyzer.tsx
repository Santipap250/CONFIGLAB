"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type Status = "idle" | "requesting" | "listening" | "denied" | "error" | "unsupported";

const FFT_SIZE = 8192; // high resolution — motor noise peaks sit close together at low Hz
const MIN_HZ = 20;
const MAX_HZ = 2000;
const PEAK_SMOOTHING = 0.85; // exponential smoothing so the readout doesn't jitter every frame

export default function MotorSoundAnalyzer({ dict }: { dict: Dictionary }) {
  const t = dict.motorSound;
  const [status, setStatus] = useState<Status>("idle");
  const [peakHz, setPeakHz] = useState<number | null>(null);
  const [level, setLevel] = useState(0); // 0..1 rough signal level for the meter
  const [bladeCount, setBladeCount] = useState(3);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const smoothedPeakRef = useRef<number | null>(null);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!supported) setStatus("unsupported");

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setStatus("error");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyserRef.current = analyser;

      setStatus("listening");
      draw();
    } catch {
      setStatus("denied");
    }
  }

  function stop() {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    smoothedPeakRef.current = null;
    setPeakHz(null);
    setLevel(0);
    setStatus((s) => (s === "listening" ? "idle" : s));
  }

  function draw() {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const ctx2d = canvas?.getContext("2d");
    if (!canvas || !analyser || !ctx2d) return;

    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    const sampleRate = audioCtxRef.current?.sampleRate ?? 48000;
    const hzPerBin = sampleRate / analyser.fftSize;
    const minBin = Math.max(1, Math.floor(MIN_HZ / hzPerBin));
    const maxBin = Math.min(bufferLength - 1, Math.ceil(MAX_HZ / hzPerBin));

    const w = canvas.width;
    const h = canvas.height;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      analyser.getByteFrequencyData(freqData);

      // find the dominant peak within our range of interest
      let maxVal = 0;
      let maxBinIdx = minBin;
      let sum = 0;
      for (let i = minBin; i <= maxBin; i++) {
        sum += freqData[i];
        if (freqData[i] > maxVal) {
          maxVal = freqData[i];
          maxBinIdx = i;
        }
      }
      const avg = sum / (maxBin - minBin + 1);
      setLevel(Math.min(1, avg / 90));

      if (maxVal > 40) {
        const hz = maxBinIdx * hzPerBin;
        smoothedPeakRef.current =
          smoothedPeakRef.current == null
            ? hz
            : smoothedPeakRef.current * PEAK_SMOOTHING + hz * (1 - PEAK_SMOOTHING);
        setPeakHz(Math.round(smoothedPeakRef.current));
      }

      // draw spectrum bars
      ctx2d.clearRect(0, 0, w, h);
      const barCount = maxBin - minBin;
      const barWidth = w / barCount;
      for (let i = 0; i < barCount; i++) {
        const v = freqData[minBin + i] / 255;
        const barH = v * h;
        const isPeak = minBin + i === maxBinIdx;
        ctx2d.fillStyle = isPeak ? "#ff8a3d" : "#4ce0d2";
        ctx2d.globalAlpha = isPeak ? 1 : 0.55;
        ctx2d.fillRect(i * barWidth, h - barH, Math.max(1, barWidth - 1), barH);
      }
      ctx2d.globalAlpha = 1;
    };
    loop();
  }

  const estimatedRpm =
    peakHz && bladeCount > 0 ? Math.round((peakHz * 60) / bladeCount) : null;

  return (
    <div>
      <p className="max-w-xl text-sm leading-relaxed text-[color:var(--color-ash)]">{t.intro}</p>

      <div className="mt-8 rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-5">
        {status === "unsupported" && (
          <p className="text-sm text-[color:var(--color-signal-amber)]">{t.notSupported}</p>
        )}
        {status === "error" && (
          <p className="text-sm text-[color:var(--color-signal-amber)]">{t.needsHttps}</p>
        )}
        {status === "denied" && (
          <p className="text-sm text-[color:var(--color-signal-amber)]">{t.denied}</p>
        )}

        {(status === "idle" || status === "requesting" || status === "listening") && (
          <div className="flex flex-wrap items-center gap-4">
            {status !== "listening" ? (
              <button
                type="button"
                onClick={start}
                disabled={status === "requesting"}
                className="rounded-sm bg-[color:var(--color-phosphor)] px-5 py-2.5 font-[family-name:var(--font-mono)] text-[13px] font-medium text-[color:var(--color-carbon)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "requesting" ? t.requesting : t.start}
              </button>
            ) : (
              <button
                type="button"
                onClick={stop}
                className="rounded-sm border border-[color:var(--color-signal-amber)] px-5 py-2.5 font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-signal-amber)] transition-colors hover:bg-[color:var(--color-signal-amber)] hover:text-[color:var(--color-carbon)]"
              >
                {t.stop}
              </button>
            )}

            {status === "listening" && (
              <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--color-phosphor)]" />
                {t.listening}
              </span>
            )}
          </div>
        )}
      </div>

      {status === "listening" && (
        <>
          <div className="mt-6 overflow-hidden rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-4">
            <canvas ref={canvasRef} width={800} height={220} className="h-[180px] w-full" />
            <div className="mt-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
              <span>{MIN_HZ} Hz</span>
              <span>{MAX_HZ} Hz</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-5">
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
                {t.peakFrequency}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-signal-amber)] text-glow">
                {peakHz ? `${peakHz} Hz` : t.noPeakYet}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <label className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-ash)]">
                  {t.bladeCount}
                </label>
                <select
                  value={bladeCount}
                  onChange={(e) => setBladeCount(Number(e.target.value))}
                  className="rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon)] px-2 py-1 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-paper)]"
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              {estimatedRpm && (
                <p className="mt-3 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-ash)]">
                  {t.estimatedRpmFromPeak}: <span className="text-[color:var(--color-paper)]">{estimatedRpm} RPM</span>
                </p>
              )}
            </div>

            <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-5">
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
                {t.signalLevel}
              </p>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[color:var(--color-carbon)]">
                <div
                  className="h-full rounded-full bg-[color:var(--color-phosphor)] transition-all duration-150"
                  style={{ width: `${Math.round(level * 100)}%` }}
                />
              </div>
              {level < 0.15 && (
                <p className="mt-3 text-[12px] text-[color:var(--color-signal-amber)]">{t.signalWeak}</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-8 space-y-2">
        <p className="text-[12px] leading-relaxed text-[color:var(--color-ash)]">{t.privacyNote}</p>
        <p className="text-[12px] leading-relaxed text-[color:var(--color-ash)]">{t.accuracyNote}</p>
      </div>
    </div>
  );
}
