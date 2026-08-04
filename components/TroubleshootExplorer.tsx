"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TroubleshootEntry } from "@/lib/troubleshoot-data";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { withLocale, type Locale } from "@/lib/i18n/locales";

export default function TroubleshootExplorer({
  entries,
  dict,
  locale,
}: {
  entries: TroubleshootEntry[];
  dict: Dictionary;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.category))),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesCategory = !category || e.category === category;
      const matchesQuery =
        !q ||
        e.symptom.toLowerCase().includes(q) ||
        e.causes.some((c) => c.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [entries, query, category]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={dict.troubleshoot.searchPlaceholder}
        className="w-full max-w-xl rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-paper)] outline-none placeholder:text-[color:var(--color-ash)] focus:border-[color:var(--color-phosphor-dim)]"
      />

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`rounded-sm border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] transition-colors ${
            category === null
              ? "border-[color:var(--color-signal-amber)] text-[color:var(--color-signal-amber)]"
              : "border-[color:var(--color-carbon-line)] text-[color:var(--color-ash)] hover:border-[color:var(--color-signal-amber)]"
          }`}
        >
          {dict.troubleshoot.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-sm border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] transition-colors ${
              category === cat
                ? "border-[color:var(--color-signal-amber)] text-[color:var(--color-signal-amber)]"
                : "border-[color:var(--color-carbon-line)] text-[color:var(--color-ash)] hover:border-[color:var(--color-signal-amber)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-ash)]">
            {dict.troubleshoot.noMatches}
          </p>
        )}
        {filtered.map((e) => (
          <details
            key={e.id}
            className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] open:border-[color:var(--color-signal-amber)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-signal-amber)]" />
                <span className="font-[family-name:var(--font-display)] text-[15px] font-medium text-[color:var(--color-paper)]">
                  {e.symptom}
                </span>
              </div>
              <span className="shrink-0 rounded-sm border border-[color:var(--color-carbon-line)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[color:var(--color-ash)]">
                {e.category}
              </span>
            </summary>
            <div className="border-t border-[color:var(--color-carbon-line)] px-5 py-4">
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[color:var(--color-ash)]">
                {dict.troubleshoot.likelyCauses}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[color:var(--color-paper)]">
                {e.causes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[color:var(--color-phosphor)]">
                {dict.troubleshoot.fixPath}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-paper)]">
                {e.fix}
              </p>
              {e.relatedKnowledge && (
                <Link
                  href={withLocale(locale, `/knowledge/${e.relatedKnowledge}`)}
                  className="mt-4 inline-block font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)]"
                >
                  {dict.troubleshoot.relatedLink}
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
