"use client";

import { useMemo, useState } from "react";

const CELL_NOMINAL = 3.7;
const CELL_FULL = 4.2;
const CELL_STORAGE_MIN = 3.3; // conservative per-cell floor to protect the pack

import type { Dictionary } from "@/lib/i18n/get-dictionary";

export default function BatteryCalculator({ dict }: { dict: Dictionary }) {
  const t = dict.battery;
  const [capacity, setCapacity] = useState(1300); // mAh
  const [cRating, setCRating] = useState(75);
  const [cells, setCells] = useState(6); // S count
  const [avgCurrent, setAvgCurrent] = useState(35); // A

  const stats = useMemo(() => {
    const usableFraction = 0.8; // leave ~20% to protect the pack
    const usableMah = capacity * usableFraction;
    const flightMinutes = (usableMah / 1000 / avgCurrent) * 60;
    const maxContinuousA = (capacity * cRating) / 1000;
    const headroomPct = ((maxContinuousA - avgCurrent) / maxContinuousA) * 100;
    const nominalV = cells * CELL_NOMINAL;
    const fullV = cells * CELL_FULL;
    const minV = cells * CELL_STORAGE_MIN;
    return { flightMinutes, maxContinuousA, headroomPct, nominalV, fullV, minV };
  }, [capacity, cRating, cells, avgCurrent]);

  const tight = stats.headroomPct < 20;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="space-y-6">
        <Field
          label={t.capacity}
          unit="mAh"
          value={capacity}
          onChange={setCapacity}
          min={100}
          max={10000}
          step={50}
        />
        <Field
          label={t.cRating}
          unit="C"
          value={cRating}
          onChange={setCRating}
          min={5}
          max={150}
          step={5}
        />
        <Field
          label={t.cellCount}
          unit="S"
          value={cells}
          onChange={setCells}
          min={1}
          max={12}
          step={1}
        />
        <Field
          label={t.avgCurrent}
          unit="A"
          value={avgCurrent}
          onChange={setAvgCurrent}
          min={1}
          max={200}
          step={1}
        />
      </div>

      <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
          {t.estimate}
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-[color:var(--color-phosphor)] text-glow">
          {stats.flightMinutes.toFixed(1)}
          <span className="ml-2 text-lg text-[color:var(--color-ash)]">{t.flightTime}</span>
        </p>
        <p className="mt-1 text-[12px] text-[color:var(--color-ash)]">
{t.usableNote}
        </p>

        <div className="signal-rule my-6" />

        <dl className="grid grid-cols-2 gap-y-4 font-[family-name:var(--font-mono)] text-[13px]">
          <Stat label={t.maxContinuous} value={`${stats.maxContinuousA.toFixed(0)} A`} />
          <Stat
            label={t.headroom}
            value={`${stats.headroomPct.toFixed(0)}%`}
            warn={tight}
          />
          <Stat label={t.nominalV} value={`${stats.nominalV.toFixed(1)} V`} />
          <Stat label={t.fullCharge} value={`${stats.fullV.toFixed(1)} V`} />
          <Stat label={t.conservativeFloor} value={`${stats.minV.toFixed(1)} V`} />
        </dl>

        {tight && (
          <p className="mt-5 rounded-sm border border-[color:var(--color-signal-amber)] bg-[color:var(--color-signal-amber)]/10 px-4 py-3 text-[12px] text-[color:var(--color-signal-amber)]">
{t.tightWarning}
          </p>
        )}
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

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <dt className="text-[color:var(--color-ash)]">{label}</dt>
      <dd
        className={
          warn
            ? "mt-0.5 text-[color:var(--color-signal-amber)]"
            : "mt-0.5 text-[color:var(--color-paper)]"
        }
      >
        {value}
      </dd>
    </div>
  );
}
