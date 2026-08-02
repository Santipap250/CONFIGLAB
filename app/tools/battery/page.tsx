import BatteryCalculator from "@/components/BatteryCalculator";

export const metadata = {
  title: "Battery & Flight Time Calculator — OBIXCONFIG LAB",
  description:
    "Estimate flight time and continuous-current headroom from capacity, C-rating, and cell count.",
};

export default function BatteryToolPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        Tools
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Battery &amp; Flight Time
      </h1>
      <div className="mt-10">
        <BatteryCalculator />
      </div>
    </div>
  );
}
