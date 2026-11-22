// Word-by-word mask reveal. Animates when Fx adds .in (data-r="split").
export default function Split({ text, as: Tag = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "p"; className?: string }) {
  return (
    <Tag className={`split ${className}`} data-r="split" aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span className="sw" key={i} aria-hidden><span style={{ ["--i" as any]: i }}>{w}</span>{" "}</span>
      ))}
    </Tag>
  );
}
