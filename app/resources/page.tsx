const RESOURCES = [
  {
    title: "Betaflight (official firmware repository)",
    href: "https://github.com/betaflight/betaflight",
    desc: "Source code, release notes, and the canonical place to confirm exact CLI behavior for your firmware version.",
  },
  {
    title: "Betaflight Configurator",
    href: "https://github.com/betaflight/betaflight-configurator",
    desc: "The desktop app used to flash firmware, edit CLI settings, and pull blackbox logs off your flight controller.",
  },
  {
    title: "OBIXCONFIG LAB (this project)",
    href: "https://github.com/Santipap250/LABFPV-",
    desc: "Source for this site — open an issue or PR to contribute a fix or a new reference entry.",
  },
];

export const metadata = {
  title: "Resources — OBIXCONFIG LAB",
  description: "Official Betaflight resources and how to contribute to OBIXCONFIG LAB.",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        Community
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Resources
      </h1>
      <p className="mt-4 text-[color:var(--color-ash)]">
        This Lab is a reference layer on top of Betaflight, not a
        replacement for its own documentation. Start here for anything
        firmware-specific.
      </p>

      <div className="mt-12 space-y-4">
        {RESOURCES.map((r) => (
          <a
            key={r.href}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-md border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] p-6 transition-colors hover:border-[color:var(--color-phosphor-dim)]"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--color-paper)] transition-colors group-hover:text-[color:var(--color-phosphor)]">
              {r.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ash)]">
              {r.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
