"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { parseSetLines, analyzeSettings, type AnalyzedSetting } from "@/lib/cli-parser";

const EXAMPLE = `# Betaflight / STM32F7X2 (S7X2) 4.5.0
set gyro_lpf1_static_hz = 300
set dyn_notch_min_hz = 80
set dyn_notch_max_hz = 500
set dshot_idle_value = 380
set vbat_min_cell_voltage = 310
set p_pitch = 52
set i_pitch = 84
set d_pitch = 34
set failsafe_procedure = DROP
set motor_output_limit = 100
set angle_limit = 60`;

const LEVEL_STYLE: Record<AnalyzedSetting["flags"][number]["level"], string> = {
  error: "border-[color:var(--color-signal-amber)] text-[color:var(--color-signal-amber)]",
  warn: "border-[color:var(--color-signal-amber)] text-[color:var(--color-signal-amber)]",
  info: "border-[color:var(--color-phosphor-dim)] text-[color:var(--color-phosphor)]",
};

export default function ConfigAnalyzer() {
  const [raw, setRaw] = useState("");
  const [showUnrecognized, setShowUnrecognized] = useState(false);
  const [showUnchanged, setShowUnchanged] = useState(false);

  const { results, summary } = useMemo(() => {
    const parsed = parseSetLines(raw);
    return analyzeSettings(parsed);
  }, [raw]);

  const flagged = results.filter((r) => r.flags.length > 0);
  const customized = results.filter((r) => r.entry && !r.isDefault && r.flags.length === 0);
  const unchanged = results.filter((r) => r.entry && r.isDefault && r.flags.length === 0);
  const unrecognized = results.filter((r) => !r.entry);

  const hasInput = raw.trim().length > 0;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={"Paste your Betaflight `diff all` or `dump` output here…"}
          rows={12}
          spellCheck={false}
          className="w-full resize-y rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-4 font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-[color:var(--color-paper)] outline-none placeholder:text-[color:var(--color-ash)] focus:border-[color:var(--color-phosphor-dim)]"
        />
        <div className="flex flex-row gap-3 lg:flex-col">
          <button
            type="button"
            onClick={() => setRaw(EXAMPLE)}
            className="whitespace-nowrap rounded-sm border border-[color:var(--color-carbon-line)] px-4 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-phosphor-dim)] hover:text-[color:var(--color-phosphor)]"
          >
            Load example
          </button>
          <button
            type="button"
            onClick={() => setRaw("")}
            className="whitespace-nowrap rounded-sm border border-[color:var(--color-carbon-line)] px-4 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-ash)] transition-colors hover:border-[color:var(--color-signal-amber)] hover:text-[color:var(--color-signal-amber)]"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
        Everything here runs in your browser — nothing you paste is uploaded or stored anywhere.
      </p>

      {!hasInput && (
        <p className="mt-10 rounded-md border border-dashed border-[color:var(--color-carbon-line)] px-5 py-8 text-center text-sm text-[color:var(--color-ash)]">
          In Betaflight Configurator, go to the CLI tab and type{" "}
          <code className="text-[color:var(--color-phosphor)]">diff all</code>, then paste the
          result above.
        </p>
      )}

      {hasInput && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Settings found" value={summary.totalParsed} />
            <Stat label="Recognized" value={summary.recognized} />
            <Stat label="Customized" value={summary.customized} />
            <Stat label="Flagged" value={summary.flagged} warn={summary.flagged > 0} />
          </div>

          {summary.totalParsed === 0 && (
            <p className="mt-8 text-sm text-[color:var(--color-ash)]">
              No <code className="text-[color:var(--color-phosphor)]">set key = value</code> lines
              found — paste the full <code>diff all</code> output, not just a screenshot or a
              partial copy.
            </p>
          )}

          {flagged.length > 0 && (
            <Section title="⚠ Flags — worth a look">
              {flagged.map((r) => (
                <ResultRow key={`${r.key}-${r.line}`} r={r} />
              ))}
            </Section>
          )}

          {customized.length > 0 && (
            <Section title="Customized from default">
              {customized.map((r) => (
                <ResultRow key={`${r.key}-${r.line}`} r={r} />
              ))}
            </Section>
          )}

          {unchanged.length > 0 && (
            <Section
              title={`Unchanged from default (${unchanged.length})`}
              collapsed={!showUnchanged}
              onToggle={() => setShowUnchanged((v) => !v)}
            >
              {showUnchanged &&
                unchanged.map((r) => <ResultRow key={`${r.key}-${r.line}`} r={r} muted />)}
            </Section>
          )}

          {unrecognized.length > 0 && (
            <Section
              title={`Not yet in our reference set (${unrecognized.length})`}
              collapsed={!showUnrecognized}
              onToggle={() => setShowUnrecognized((v) => !v)}
            >
              {showUnrecognized && (
                <p className="mb-3 px-4 pt-3 text-[12px] text-[color:var(--color-ash)]">
                  These parsed fine, but the CLI Library doesn&apos;t have a reference entry for
                  them yet — shown as-is, no judgment made.
                </p>
              )}
              {showUnrecognized &&
                unrecognized.map((r) => (
                  <div
                    key={`${r.key}-${r.line}`}
                    className="flex items-center justify-between border-b border-[color:var(--color-carbon-line)] px-4 py-2 font-[family-name:var(--font-mono)] text-[12px] last:border-b-0"
                  >
                    <span className="text-[color:var(--color-ash)]">{r.key}</span>
                    <span className="text-[color:var(--color-paper)]">{r.value}</span>
                  </div>
                ))}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-4 py-3">
      <p
        className={`font-[family-name:var(--font-display)] text-2xl font-semibold ${
          warn ? "text-[color:var(--color-signal-amber)]" : "text-[color:var(--color-phosphor)]"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
        {label}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
  collapsed,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="mt-10">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.15em] text-[color:var(--color-ash)] hover:text-[color:var(--color-phosphor)]"
        >
          <span>{title}</span>
          <span>{collapsed ? "show" : "hide"}</span>
        </button>
      ) : (
        <h2 className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.15em] text-[color:var(--color-ash)]">
          {title}
        </h2>
      )}
      <div className="mt-3 overflow-hidden rounded-md border border-[color:var(--color-carbon-line)]">
        {children}
      </div>
    </div>
  );
}

function ResultRow({ r, muted }: { r: AnalyzedSetting; muted?: boolean }) {
  return (
    <div className="border-b border-[color:var(--color-carbon-line)] px-4 py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2">
          {r.anchor ? (
            <Link
              href={`/cli#${r.anchor}`}
              className="font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-phosphor)] hover:underline"
            >
              {r.key}
            </Link>
          ) : (
            <span className="font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-paper)]">
              {r.key}
            </span>
          )}
          <span
            className={`font-[family-name:var(--font-mono)] text-[13px] ${
              muted ? "text-[color:var(--color-ash)]" : "text-[color:var(--color-paper)]"
            }`}
          >
            = {r.value}
          </span>
        </div>
        {r.defaultValue && !r.isDefault && (
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
            default: {r.defaultValue}
          </span>
        )}
      </div>
      {!muted && r.entry?.description && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-[color:var(--color-ash)]">
          {r.entry.description}
        </p>
      )}
      {r.flags.map((f, i) => (
        <p key={i} className={`mt-2 rounded-sm border px-2.5 py-1.5 text-[12px] ${LEVEL_STYLE[f.level]}`}>
          {f.message}
        </p>
      ))}
    </div>
  );
}
