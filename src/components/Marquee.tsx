export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="ticker" aria-hidden>
      <div>{[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}
