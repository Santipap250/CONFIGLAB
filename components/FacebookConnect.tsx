import { ArrowUpRight } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/banmysanti";

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

export default function FacebookConnect() {
  return (
    <a
      href={FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-[color:var(--color-carbon-line)] bg-[color:var(--color-carbon-raised)] py-3 pl-3 pr-6 transition-all duration-300 hover:border-[color:var(--color-phosphor)] hover:shadow-[0_0_28px_-4px_var(--color-phosphor)]"
    >
      {/* rippling signal rings behind the icon */}
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <span
          aria-hidden="true"
          className="pulse-ring absolute inset-0 rounded-full border border-[color:var(--color-phosphor)]"
        />
        <span
          aria-hidden="true"
          className="pulse-ring absolute inset-0 rounded-full border border-[color:var(--color-phosphor)]"
          style={{ animationDelay: "0.9s" }}
        />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] transition-transform duration-300 group-hover:scale-110">
          <FacebookMark />
        </span>
      </span>

      <span className="flex flex-col text-left">
        <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-[color:var(--color-paper)]">
          Follow OBIXCONFIG LAB
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[color:var(--color-ash)]">
          facebook.com/banmysanti
        </span>
      </span>

      <ArrowUpRight
        className="ml-1 h-4 w-4 shrink-0 text-[color:var(--color-phosphor)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={2.2}
      />
    </a>
  );
}
