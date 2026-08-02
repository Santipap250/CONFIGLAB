import FilterRangeHelper from "@/components/FilterRangeHelper";

export const metadata = {
  title: "Dynamic Notch Range Helper — OBIXCONFIG LAB",
  description:
    "Get a starting dyn_notch_min_hz / max_hz range from motor KV and cell count.",
};

export default function FiltersToolPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        Tools
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Dynamic Notch Range Helper
      </h1>
      <div className="mt-10">
        <FilterRangeHelper />
      </div>
    </div>
  );
}
