import Link from "next/link";
import { getSettings, getProjects, getSkills, setting } from "@/lib/content";
import Scramble from "@/components/Scramble";
import ProjectTile from "@/components/ProjectTile";
import Marquee from "@/components/Marquee";
import Split from "@/components/Split";
import Footer from "@/components/Footer";

export const revalidate = 300; // safety net if a tag revalidation is ever missed

const DOORS: [string, string, string, number][] = [
  ["/work", "Work", "Every system, inspected", 1], ["/lab", "Lab", "Unfinished by design", 2],
  ["/about", "About", "The engineer behind it", 3], ["/contact", "Contact", "Establish connection", 4],
];

export default async function Home() {
  const [s, projects, skills] = await Promise.all([
    getSettings().catch(() => ({} as Record<string, any>)),
    getProjects().catch(() => []),
    getSkills().catch(() => []),
  ]);
  const name = setting(s, "hero.name", "MD ABU TAWSIF");
  const descriptors = setting<string[]>(s, "hero.descriptors", ["AI systems", "Automation", "Software"]);
  const ticker = [...new Set([...descriptors, "Python", "FastAPI", "n8n", "Claude", "Robotics", "Mathematics", ...skills.map((k) => k.name)])];
  const featured = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 3);

  return (
    <>
      <header className="hero">
        <div className="beam" />
        <div className="wrap">
          <h1 aria-label={name}>{name.split(/\s+/).map((w) => <span className="w" key={w}><Scramble text={w} /></span>)}</h1>
          <div className="meta">
            <p className="lead">{descriptors.map((d) => <span key={d}>{d}</span>)}</p>
            <Link href="/work" className="btn mag">Enter the work</Link>
          </div>
        </div>
        <svg className="instrument" viewBox="0 0 400 400" fill="none" strokeWidth="1.2" aria-hidden>
          <line x1="200" y1="0" x2="200" y2="400" stroke="var(--line)" /><line x1="0" y1="200" x2="400" y2="200" stroke="var(--line)" />
          <g className="ring r1"><circle cx="200" cy="200" r="188" strokeDasharray="2 9" stroke="var(--c1)" /></g>
          <g className="ring r2"><circle cx="200" cy="200" r="140" strokeDasharray="44 12 4 12" stroke="var(--c2)" />
            {[[200, 60], [340, 200], [200, 340], [60, 200]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 5} y={y - 5} width="10" height="10" fill="var(--c4)" stroke="none" />)}
          </g>
          <g className="ring r3"><circle cx="200" cy="200" r="92" strokeDasharray="1 6" stroke="var(--c3)" /></g>
          <rect className="core" x="182" y="182" width="36" height="36" stroke="var(--c5)" />
          <text x="200" y="16" textAnchor="middle">DATA</text><text x="392" y="203" textAnchor="end">INTEL</text>
          <text x="200" y="394" textAnchor="middle">AUTOMATION</text><text x="8" y="203">EXEC</text>
        </svg>
        <span className="scrollcue mono">Scroll</span>
      </header>

      <Marquee items={ticker} />

      <section className="wrap sec">
        <div className="sh"><Split text="Featured systems" /><i /><Link href="/work" className="mono link">All work →</Link></div>
        {featured.length === 0 && <p className="mono">No published systems yet.</p>}
        <div className="tiles">{featured.map((p, i) => <ProjectTile key={p.id} p={p} i={i} />)}</div>
      </section>

      <section className="wrap sec">
        <div className="doors">
          {DOORS.map(([h, t, d, n]) => (
            <Link key={h} href={h} className="door" style={{ ["--hue" as any]: `var(--c${n})` }} data-r="row">
              <span className="mono">{d}</span><b>{t}</b><span className="arr">→</span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
