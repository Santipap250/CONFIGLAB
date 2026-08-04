"use client";

import { useEffect, useMemo, useState } from "react";
import type { CliCommand } from "@/lib/cli-data";
import { slugifyCommand } from "@/lib/cli-data";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export default function CliExplorer({ commands, dict }: { commands: CliCommand[]; dict: Dictionary }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(commands.map((c) => c.category))),
    [commands]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands.filter((c) => {
      const matchesCategory = !category || c.category === category;
      const matchesQuery =
        !q ||
        c.command.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [commands, query, category]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    // Give the list a tick to render before we look for the element.
    const t = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.cli.searchPlaceholder}
          className="w-full max-w-md rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-paper)] outline-none placeholder:text-[color:var(--color-ash)] focus:border-[color:var(--color-phosphor-dim)]"
        />
        <p className="font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-ash)]">
          {filtered.length} / {commands.length} {dict.cli.countOf}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`rounded-sm border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] transition-colors ${
            category === null
              ? "border-[color:var(--color-phosphor)] text-[color:var(--color-phosphor)]"
              : "border-[color:var(--color-carbon-line)] text-[color:var(--color-ash)] hover:border-[color:var(--color-phosphor-dim)]"
          }`}
        >
          {dict.cli.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-sm border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] transition-colors ${
              category === cat
                ? "border-[color:var(--color-phosphor)] text-[color:var(--color-phosphor)]"
                : "border-[color:var(--color-carbon-line)] text-[color:var(--color-ash)] hover:border-[color:var(--color-phosphor-dim)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-ash)]">
            {dict.cli.noMatches} &quot;{query}&quot;.
          </p>
        )}
        {filtered.map((c) => (
          <details
            key={c.command}
            id={slugifyCommand(c.command)}
            className="group rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] open:border-[color:var(--color-phosphor-dim)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <code className="font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-phosphor)]">
                  {c.command}
                </code>
                <span className="rounded-sm border border-[color:var(--color-carbon-line)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[color:var(--color-ash)]">
                  {c.category}
                </span>
              </div>
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-[color:var(--color-carbon-line)] px-5 py-4">
              <p className="text-sm leading-relaxed text-[color:var(--color-paper)]">
                {c.description}
              </p>
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-[family-name:var(--font-mono)] text-[12px]">
                <div>
                  <dt className="text-[color:var(--color-ash)]">{dict.cli.type}</dt>
                  <dd className="text-[color:var(--color-paper)]">{c.type}</dd>
                </div>
                <div>
                  <dt className="text-[color:var(--color-ash)]">{dict.cli.default}</dt>
                  <dd className="text-[color:var(--color-phosphor)]">{c.default}</dd>
                </div>
                {c.range && (
                  <div>
                    <dt className="text-[color:var(--color-ash)]">{dict.cli.range}</dt>
                    <dd className="text-[color:var(--color-paper)]">{c.range}</dd>
                  </div>
                )}
              </dl>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
