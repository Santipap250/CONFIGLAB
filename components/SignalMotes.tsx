// A small swarm of glowing motes that drift and flicker like fireflies —
// pure CSS animation (transform + opacity only, no JS loop), so it's cheap
// on mobile and respects prefers-reduced-motion via globals.css.
const MOTES = [
  { top: "18%", left: "8%", size: 5, color: "#4ce0d2", anim: "mote-drift-a", duration: "9s", delay: "0s" },
  { top: "62%", left: "14%", size: 3, color: "#ff8a3d", anim: "mote-drift-b", duration: "12s", delay: "1.5s" },
  { top: "30%", left: "22%", size: 4, color: "#2b8f86", anim: "mote-drift-c", duration: "10.5s", delay: "0.6s" },
  { top: "12%", left: "78%", size: 4, color: "#4ce0d2", anim: "mote-drift-b", duration: "11s", delay: "2.2s" },
  { top: "70%", left: "85%", size: 5, color: "#4ce0d2", anim: "mote-drift-a", duration: "13s", delay: "0.8s" },
  { top: "45%", left: "92%", size: 3, color: "#ff8a3d", anim: "mote-drift-c", duration: "9.5s", delay: "3s" },
  { top: "80%", left: "45%", size: 3, color: "#2b8f86", anim: "mote-drift-a", duration: "10s", delay: "1.1s" },
  { top: "8%", left: "48%", size: 4, color: "#4ce0d2", anim: "mote-drift-c", duration: "12.5s", delay: "2.6s" },
];

export default function SignalMotes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={{
            top: m.top,
            left: m.left,
            width: m.size,
            height: m.size,
            background: m.color,
            boxShadow: `0 0 ${m.size * 2.5}px ${m.color}`,
            animation: `${m.anim} ${m.duration} ease-in-out ${m.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
