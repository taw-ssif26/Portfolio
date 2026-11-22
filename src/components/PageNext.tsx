import Link from "next/link";

export default function PageNext({ href, label, hue = 2 }: { href: string; label: string; hue?: number }) {
  return (
    <Link href={href} className="next mag" style={{ ["--hue" as any]: `var(--c${hue})` }}>
      <span className="mono">Next</span><span className="nl">{label}</span><span className="arr">→</span>
    </Link>
  );
}
