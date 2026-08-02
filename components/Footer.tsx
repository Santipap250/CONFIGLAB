import Link from "next/link";

const COLUMNS = [
  {
    title: "Library",
    links: [
      { href: "/knowledge", label: "Knowledge Hub" },
      { href: "/cli", label: "CLI Library" },
      { href: "/articles", label: "Articles" },
    ],
  },
  {
    title: "Diagnose",
    links: [
      { href: "/troubleshoot", label: "Troubleshooting" },
      { href: "/tuning", label: "Tuning Guide" },
      { href: "/tools", label: "Tools & Calculators" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "/about", label: "About" },
      { href: "/changelog", label: "Changelog" },
      { href: "/faq", label: "FAQ / Support" },
      { href: "/resources", label: "Community" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-carbon-line)]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.25em] text-[color:var(--color-paper)]">
              OBIXCONFIG&nbsp;<span className="text-[color:var(--color-phosphor)]">LAB</span>
            </span>
            <p className="mt-3 max-w-[22ch] font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[color:var(--color-ash)]">
              A signal-grade reference lab for FPV tuning &amp; Betaflight configuration.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-phosphor-dim)]">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[color:var(--color-ash)] transition-colors hover:text-[color:var(--color-phosphor)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="signal-rule my-10" />
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
          © {new Date().getFullYear()} OBIXCONFIG LAB — built for pilots who read their own blackbox.
        </p>
      </div>
    </footer>
  );
}
