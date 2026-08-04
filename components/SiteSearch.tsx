"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { SearchItem } from "@/lib/search-index";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

function matches(item: SearchItem, query: string) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = `${item.title} ${item.description} ${item.meta ?? ""}`.toLowerCase();
  return words.every((w) => haystack.includes(w));
}

export default function SiteSearch({ index, dict }: { index: SearchItem[]; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const filtered = index.filter((item) => matches(item, query));
    return filtered.slice(0, 40);
  }, [index, query]);

  // Global ⌘K / Ctrl+K shortcut to open from anywhere on the site.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // focus after the modal paints
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(item: SearchItem) {
    setOpen(false);
    router.push(item.href);
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item);
      return;
    }
    // Minimal focus trap within the dialog.
    if (e.key === "Tab" && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        "input, button, a[href]"
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.searchSite}
        className="flex items-center gap-2 rounded-sm border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] px-3 py-1.5 text-[color:var(--color-ash)] transition-colors hover:border-[color:var(--color-phosphor-dim)] hover:text-[color:var(--color-paper)]"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
        <span className="hidden font-[family-name:var(--font-mono)] text-[12px] sm:inline">
          {dict.nav.search}
        </span>
        <kbd className="hidden rounded-sm border border-[color:var(--color-carbon-line)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--color-ash)] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-md border border-[color:var(--color-phosphor-dim)] bg-[color:var(--color-carbon-raised)] shadow-[0_0_60px_-12px_var(--color-phosphor)]"
          >
            <div className="flex items-center gap-3 border-b border-[color:var(--color-carbon-line)] px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-[color:var(--color-phosphor)]" strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.search.placeholder}
                className="w-full bg-transparent font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-paper)] outline-none placeholder:text-[color:var(--color-ash)]"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={dict.search.close}
                className="shrink-0 text-[color:var(--color-ash)] hover:text-[color:var(--color-paper)]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <p className="px-4 py-8 text-center font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-ash)]">
                  {dict.search.noMatches} &quot;{query}&quot;.
                </p>
              )}
              {results.map((item, i) => (
                <button
                  key={`${item.type}-${item.title}-${i}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => go(item)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    i === activeIndex
                      ? "bg-[color:var(--color-carbon-line)]"
                      : "bg-transparent"
                  }`}
                >
                  <span className="mt-0.5 shrink-0 rounded-sm border border-[color:var(--color-carbon-line)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[color:var(--color-phosphor)]">
                    {dict.search.types[item.type]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-[family-name:var(--font-display)] text-[14px] font-medium text-[color:var(--color-paper)]">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-[color:var(--color-ash)]">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-[color:var(--color-carbon-line)] px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--color-ash)]">
              <span>↑↓ {dict.search.navigate}</span>
              <span>↵ {dict.search.open}</span>
              <span>esc {dict.search.escClose}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
