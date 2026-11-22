// Generated visual per project type, drawn in the project's hue (currentColor).
export default function Motif({ kind }: { kind: string }) {
  const common = { viewBox: "0 0 240 130", fill: "none", stroke: "currentColor", strokeWidth: 1.2, "aria-hidden": true, className: "motif" } as const;
  if (kind === "flow") return (
    <svg {...common}>
      <path className="dashflow" d="M24 65 C70 20 90 110 130 65 S190 30 216 65" strokeDasharray="4 6" />
      {[[24, 65], [90, 62], [130, 65], [216, 65]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill="var(--bg)" />)}
      <circle className="ping" cx="130" cy="65" r="9" />
    </svg>
  );
  if (kind === "conversation") return (
    <svg {...common}>
      <rect x="20" y="16" width="110" height="28" rx="14" /><rect x="110" y="54" width="110" height="28" rx="14" fill="currentColor" fillOpacity=".15" />
      <rect x="20" y="92" width="70" height="26" rx="13" />
      {[0, 1, 2].map((i) => <circle key={i} className="typing" style={{ animationDelay: `${i * 0.2}s` }} cx={44 + i * 12} cy="105" r="2.6" fill="currentColor" />)}
    </svg>
  );
  if (kind === "sensor") return (
    <svg {...common}>
      {[18, 36, 54].map((r) => <circle key={r} cx="120" cy="65" r={r} />)}
      <line x1="120" y1="11" x2="120" y2="119" opacity=".3" /><line x1="66" y1="65" x2="174" y2="65" opacity=".3" />
      <g className="sweep"><path d="M120 65 L174 65 A54 54 0 0 0 158 27 Z" fill="currentColor" fillOpacity=".18" stroke="none" /><line x1="120" y1="65" x2="174" y2="65" /></g>
      <circle className="ping" cx="150" cy="45" r="3" fill="currentColor" />
    </svg>
  );
  if (kind === "geometry") return (
    <svg {...common}>
      <g className="spin" style={{ transformOrigin: "120px 65px" }}><polygon points="120,12 166,92 74,92" /></g>
      <g className="spin r" style={{ transformOrigin: "120px 65px" }}><rect x="84" y="29" width="72" height="72" /></g>
      <g className="spin slow" style={{ transformOrigin: "120px 65px" }}><polygon points="120,6 170,35 170,95 120,124 70,95 70,35" /></g>
    </svg>
  );
  if (kind === "architecture") return (
    <svg {...common}>
      {[18, 44, 70, 96].map((y, i) => <rect key={y} x={60 - i * 0} y={y} width="120" height="20" fill={i === 1 ? "currentColor" : "none"} fillOpacity=".15" />)}
      {[38, 64, 90].map((y) => <line key={y} x1="120" y1={y} x2="120" y2={y + 6} />)}
      <circle className="drop" cx="120" cy="18" r="3.4" fill="currentColor" />
    </svg>
  );
  return (
    <svg {...common}>
      {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 12 }).map((__, c) => (
        <rect key={`${r}${c}`} className="cell" style={{ animationDelay: `${((r * 12 + c) % 9) * 0.25}s` }} x={20 + c * 17.5} y={14 + r * 19} width="8" height="8" fill="currentColor" stroke="none" />
      )))}
    </svg>
  );
}
