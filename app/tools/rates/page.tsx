import RatesVisualizer from "@/components/RatesVisualizer";

export const metadata = {
  title: "Rates Visualizer — OBIXCONFIG LAB",
  description:
    "See the stick-to-rotation-rate curve shaped by RC Rate, Super Rate, and Expo.",
};

export default function RatesToolPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-phosphor-dim)]">
        Tools
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[color:var(--color-paper)] md:text-4xl">
        Rates Visualizer
      </h1>
      <div className="mt-10">
        <RatesVisualizer />
      </div>
    </div>
  );
}
