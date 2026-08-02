"use client";

import { useMemo, useState } from "react";

const WIDTH = 560;
const HEIGHT = 320;
const PAD = 40;

function computeRate(stickPct: number, rcRate: number, superRate: number, expo: number) {
  // stickPct: -100..100
  const stick = stickPct / 100; // -1..1
  const expoStick = stick * (1 - expo) + Math.pow(stick, 3) * expo;
  const superRateClamped = Math.min(superRate, 0.99);
  const denom = 1 - superRateClamped * Math.abs(expoStick);
  const rate = (rcRate * 200 * expoStick) / (denom || 0.01);
  return rate;
}

export default function RatesVisualizer() {
  const [rcRate, setRcRate] = useState(1.0);
  const [superRate, setSuperRate] = useState(0.7);
  const [expo, setExpo] = useState(0.0);

  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let s = -100; s <= 100; s += 2) {
      pts.push({ x: s, y: computeRate(s, rcRate, superRate, expo) });
    }
    return pts;
  }, [rcRate, superRate, expo]);

  const maxRate = Math.max(...points.map((p) => Math.abs(p.y)), 100);
  const centerSensitivity = computeRate(2, rcRate, superRate, expo) / 2 * 100; // deg/s per 1% stick near center, roughly

  const toSvgX = (stick: number) =>
    PAD + ((stick + 100) / 200) * (WIDTH - PAD * 2);
  const toSvgY = (rate: number) =>
    HEIGHT / 2 - (rate / maxRate) * (HEIGHT / 2 - PAD / 2);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x).toFixed(1)} ${toSvgY(p.y).toFixed(1)}`)
    .join(" ");

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
      <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Rotation rate versus stick position curve"
        >
          {/* grid */}
          {[-100, -50, 0, 50, 100].map((s) => (
            <line
              key={s}
              x1={toSvgX(s)}
              y1={PAD / 2}
              x2={toSvgX(s)}
              y2={HEIGHT - PAD / 2}
              stroke="var(--color-carbon-line)"
              strokeWidth={1}
            />
          ))}
          <line
            x1={PAD}
            y1={HEIGHT / 2}
            x2={WIDTH - PAD}
            y2={HEIGHT / 2}
            stroke="var(--color-carbon-line)"
            strokeWidth={1}
          />
          {/* curve */}
          <path d={path} fill="none" stroke="var(--color-phosphor)" strokeWidth={2} />
          {/* axis labels */}
          {[-100, -50, 0, 50, 100].map((s) => (
            <text
              key={s}
              x={toSvgX(s)}
              y={HEIGHT - 10}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-mono)"
              fill="var(--color-ash)"
            >
              {s}%
            </text>
          ))}
          <text
            x={PAD}
            y={PAD - 8}
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--color-ash)"
          >
            +{maxRate.toFixed(0)}°/s
          </text>
          <text
            x={PAD}
            y={HEIGHT - PAD + 20}
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--color-ash)"
          >
            −{maxRate.toFixed(0)}°/s
          </text>
        </svg>
        <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
          Approximate curve for visualizing feel — for exact firmware values,
          always confirm in Betaflight Configurator.
        </p>
      </div>

      <div className="space-y-6">
        <Field label="RC Rate" value={rcRate} onChange={setRcRate} min={0.1} max={2.5} step={0.05} />
        <Field label="Super Rate" value={superRate} onChange={setSuperRate} min={0} max={0.95} step={0.01} />
        <Field label="Expo" value={expo} onChange={setExpo} min={0} max={1} step={0.01} />

        <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-5">
          <dl className="space-y-3 font-[family-name:var(--font-mono)] text-[13px]">
            <div>
              <dt className="text-[color:var(--color-ash)]">Max rate</dt>
              <dd className="text-[color:var(--color-phosphor)]">
                {maxRate.toFixed(0)}°/s
              </dd>
            </div>
            <div>
              <dt className="text-[color:var(--color-ash)]">Center feel</dt>
              <dd className="text-[color:var(--color-paper)]">
                {centerSensitivity.toFixed(0)}°/s per 1% stick
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-ash)]">
          {label}
        </label>
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-phosphor)]">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[color:var(--color-phosphor)]"
      />
    </div>
  );
}
