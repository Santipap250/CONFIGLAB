export default function HudFrame() {
  const corner =
    "pointer-events-none fixed w-6 h-6 border-[color:var(--color-phosphor-dim)] z-40";
  return (
    <div aria-hidden="true">
      <div className={`${corner} top-3 left-3 border-t border-l`} />
      <div className={`${corner} top-3 right-3 border-t border-r`} />
      <div className={`${corner} bottom-3 left-3 border-b border-l`} />
      <div className={`${corner} bottom-3 right-3 border-b border-r`} />
    </div>
  );
}
