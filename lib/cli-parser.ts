import { buildCliLookup, slugifyCommand, type CliCommand } from "./cli-data";

export type ParsedSetting = { key: string; value: string; line: number };

export type AnalyzedSetting = {
  key: string;
  value: string;
  line: number;
  entry?: CliCommand;
  defaultValue?: string;
  isDefault: boolean;
  outOfRange: boolean;
  anchor?: string;
  flags: { level: "error" | "warn" | "info"; message: string }[];
};

export type AnalysisSummary = {
  totalParsed: number;
  recognized: number;
  unrecognized: number;
  customized: number;
  flagged: number;
};

/** Parses `set key = value` lines out of a Betaflight `diff`/`dump` paste.
 *  Everything else (mixer/aux/resource/comment lines, profile headers) is
 *  ignored rather than mis-parsed. */
export function parseSetLines(raw: string): ParsedSetting[] {
  const results: ParsedSetting[] = [];
  const lines = raw.split(/\r?\n/);
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^set\s+([a-z0-9_]+)\s*=\s*(.+)$/i);
    if (!match) return;
    results.push({ key: match[1].toLowerCase(), value: match[2].trim(), line: i + 1 });
  });
  return results;
}

function parseNumericRange(range?: string): [number, number] | null {
  if (!range) return null;
  const match = range.match(/(-?\d+(?:\.\d+)?)\s*[–-]\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
}

function isEnumRange(range?: string): string[] | null {
  if (!range) return null;
  if (!range.includes("/")) return null;
  // ranges like "PWM / ONESHOT125 / ... / DSHOT600" — but numeric units
  // string like "1000–2000" already excluded by the caller checking dash.
  return range.split("/").map((s) => s.trim().toUpperCase());
}

/** A handful of specific, high-value checks beyond generic range-checking —
 *  these are the "this could actually hurt you" flags. */
function specialChecks(key: string, numeric: number | null): AnalyzedSetting["flags"] {
  const flags: AnalyzedSetting["flags"] = [];
  if (key === "dshot_idle_value" && numeric !== null && numeric < 450) {
    flags.push({
      level: "warn",
      message: "Below ~450 this often causes motor stutter or stalling at idle.",
    });
  }
  if (key === "vbat_min_cell_voltage" && numeric !== null) {
    if (numeric < 320) {
      flags.push({
        level: "warn",
        message: "Below 3.20V/cell risks over-discharging the pack before the FC warns you.",
      });
    } else if (numeric > 350) {
      flags.push({
        level: "info",
        message: "Above 3.50V/cell may trigger low-voltage warnings earlier than expected.",
      });
    }
  }
  if (key === "motor_output_limit" && numeric !== null && numeric < 100) {
    flags.push({
      level: "info",
      message: "Motor output is capped below 100% — confirm this is intentional (e.g. motor break-in).",
    });
  }
  return flags;
}

export function analyzeSettings(
  parsed: ParsedSetting[]
): { results: AnalyzedSetting[]; summary: AnalysisSummary } {
  const lookup = buildCliLookup();
  const results: AnalyzedSetting[] = [];

  // For the min/max-pair check (dyn_notch_min_hz vs max_hz) we need both
  // values up front.
  const byKey = new Map(parsed.map((p) => [p.key, p.value]));

  for (const p of parsed) {
    const found = lookup.get(p.key);
    const numeric = /^-?\d+(\.\d+)?$/.test(p.value) ? parseFloat(p.value) : null;
    const flags: AnalyzedSetting["flags"] = [];
    let outOfRange = false;
    let isDefault = false;

    if (found) {
      const { entry, defaultValue } = found;
      isDefault = p.value.trim().toLowerCase() === defaultValue.trim().toLowerCase();

      const numRange = parseNumericRange(entry.range);
      const enumRange = isEnumRange(entry.range);
      if (numRange && numeric !== null) {
        const [min, max] = numRange;
        if (numeric < min || numeric > max) {
          outOfRange = true;
          flags.push({
            level: "error",
            message: `${p.value} is outside the typical ${entry.range} range for ${p.key}.`,
          });
        }
      } else if (enumRange && !enumRange.includes(p.value.toUpperCase())) {
        outOfRange = true;
        flags.push({
          level: "warn",
          message: `"${p.value}" isn't one of the values this reference expects (${entry.range}).`,
        });
      }

      flags.push(...specialChecks(p.key, numeric));
    }

    results.push({
      key: p.key,
      value: p.value,
      line: p.line,
      entry: found?.entry,
      defaultValue: found?.defaultValue,
      isDefault,
      outOfRange,
      anchor: found ? slugifyCommand(found.entry.command) : undefined,
      flags,
    });
  }

  // Cross-field check: dyn_notch_min_hz must be < dyn_notch_max_hz.
  const minHz = byKey.get("dyn_notch_min_hz");
  const maxHz = byKey.get("dyn_notch_max_hz");
  if (minHz && maxHz && parseFloat(minHz) >= parseFloat(maxHz)) {
    const target = results.find((r) => r.key === "dyn_notch_min_hz");
    target?.flags.push({
      level: "error",
      message: `dyn_notch_min_hz (${minHz}) must be lower than dyn_notch_max_hz (${maxHz}).`,
    });
  }

  const summary: AnalysisSummary = {
    totalParsed: results.length,
    recognized: results.filter((r) => r.entry).length,
    unrecognized: results.filter((r) => !r.entry).length,
    customized: results.filter((r) => r.entry && !r.isDefault).length,
    flagged: results.filter((r) => r.flags.length > 0).length,
  };

  return { results, summary };
}
