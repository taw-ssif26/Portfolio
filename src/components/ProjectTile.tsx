import Link from "next/link";
import type { projects } from "@/db/schema";
import Motif from "./Motif";

type P = typeof projects.$inferSelect;
const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectTile({ p, i }: { p: P; i: number }) {
  return (
    <Link href={`/work/${p.slug}`} className="tile tilt" style={{ ["--hue" as any]: `var(--c${(i % 5) + 1})` }} data-r="row">
      <span className="glare" />
      <div className="tt">
        <span className="mono num">Sys {pad(p.systemNumber ?? i + 1)}</span>
        <span className="mono"><i className={`dot ${p.status === "live" ? "live" : ""}`} />{p.status.replace("_", " ")}</span>
      </div>
      <Motif kind={p.visualType} />
      <h3>{p.name}</h3>
      <p className="mono cat">{p.category}</p>
      {p.tagline && <p className="tag">{p.tagline}</p>}
      <span className="go mono">Inspect →</span>
    </Link>
  );
}
