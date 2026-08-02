import Link from "next/link";

const LINKS = [
  { href: "/knowledge", label: "Knowledge" },
  { href: "/cli", label: "CLI Library" },
  { href: "/troubleshoot", label: "Troubleshoot" },
  { href: "/tuning", label: "Tuning" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Articles" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[color:var(--color-phosphor)] shadow-[0_0_10px_var(--color-phosphor)] transition-transform group-hover:scale-125"
          />
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.25em] text-[color:var(--color-paper)]">
            OBIXCONFIG&nbsp;<span className="text-[color:var(--color-phosphor)]">LAB</span>
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-[family-name:var(--font-mono)] text-[13px] text-[color:var(--color-ash)] transition-colors hover:text-[color:var(--color-phosphor)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/faq"
          className="rounded-sm border border-[color:var(--color-phosphor-dim)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] text-[color:var(--color-phosphor)] transition-colors hover:bg-[color:var(--color-phosphor)] hover:text-[color:var(--color-carbon)]"
        >
          Support
        </Link>
      </div>
    </header>
  );
}
