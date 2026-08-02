"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a set of animated waveform traces reminiscent of a blackbox
 * vibration/gyro plot — the signature visual motif for OBIXCONFIG LAB.
 * Respects prefers-reduced-motion by freezing on the first frame.
 */
export default function ScopeTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const traces = [
      { color: "#4ce0d2", amp: 0.16, freq: 0.9, speed: 0.6, phase: 0, alpha: 0.9 },
      { color: "#2b8f86", amp: 0.1, freq: 1.7, speed: 0.35, phase: 2, alpha: 0.5 },
      { color: "#ff8a3d", amp: 0.06, freq: 3.1, speed: 0.9, phase: 4, alpha: 0.35 },
    ];

    let raf = 0;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const midY = height * 0.55;

      traces.forEach((tr) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
          const nx = x / width;
          const y =
            midY +
            Math.sin(nx * Math.PI * 2 * tr.freq + t * tr.speed + tr.phase) *
              height *
              tr.amp *
              (0.6 + 0.4 * Math.sin(nx * Math.PI + t * 0.2));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = tr.color;
        ctx.globalAlpha = tr.alpha;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      t += 0.016;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}
