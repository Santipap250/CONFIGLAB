"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function roundTo(v: number, step: number) {
  return Math.round(v / step) * step;
}

export default function FilterRangeHelper() {
  const [kv, setKv] = useState(2400);
  const [cells, setCells] = useState(4);

  const result = useMemo(() => {
    const nominalV = cells * 3.7;
    const rpm = kv * nominalV;
    const rotorHz = rpm / 60;
    const notchMin = roundTo(clamp(rotorHz * 0.5, 60, 250), 10);
    const notchMax = roundTo(clamp(rotorHz * 3, 200, 1000), 10);
    return { nominalV, rpm, rotorHz, notchMin, notchMax };
  }, [kv, cells]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="space-y-6">
        <Field label="Motor KV" unit="KV" value={kv} onChange={setKv} min={800} max={4000} step={50} />
        <Field label="Cell count" unit="S" value={cells} onChange={setCells} min={1} max={12} step={1} />
        <p className="text-[13px] leading-relaxed text-[color:var(--color-ash)]">
          This is a rule-of-thumb starting point based on estimated motor RPM
          at nominal voltage — not a measurement of your actual noise
          spectrum. Always confirm against your own blackbox log; see{" "}
          <Link href="/knowledge/gyro-dterm-filters" className="text-[color:var(--color-phosphor)]">
            Understanding Gyro &amp; D-term Filters
          </Link>
          .
        </p>
      </div>

      <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
          Suggested starting range
        </p>
        <div className="mt-3 flex items-baseline gap-3">
          <code className="font-[family-name:var(--font-mono)] text-2xl text-[color:var(--color-phosphor)] text-glow">
            {result.notchMin}–{result.notchMax} Hz
          </code>
        </div>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-ash)]">
          dyn_notch_min_hz / dyn_notch_max_hz
        </p>

        <div className="signal-rule my-6" />

        <dl className="grid grid-cols-2 gap-y-4 font-[family-name:var(--font-mono)] text-[13px]">
          <div>
            <dt className="text-[color:var(--color-ash)]">Nominal pack voltage</dt>
            <dd className="text-[color:var(--color-paper)]">{result.nominalV.toFixed(1)} V</dd>
          </div>
          <div>
            <dt className="text-[color:var(--color-ash)]">Estimated motor RPM</dt>
            <dd className="text-[color:var(--color-paper)]">{Math.round(result.rpm)}</dd>
          </div>
          <div>
            <dt className="text-[color:var(--color-ash)]">Estimated rotor frequency</dt>
            <dd className="text-[color:var(--color-paper)]">{result.rotorHz.toFixed(0)} Hz</dd>
          </div>
        </dl>

        <Link
          href="/cli"
          className="mt-6 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
        >
          See dyn_notch_min_hz / max_hz in CLI Library →
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  unit: string;
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
          {value} {unit}
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
