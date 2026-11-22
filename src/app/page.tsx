import Link from "next/link";
import { getSettings, getProjects, getLab, getSkills, getSocial, setting } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";
import ContactForm from "@/components/ContactForm";
import Scramble from "@/components/Scramble";

export const revalidate = 300; // safety net if a tag revalidation is ever missed

const pad = (n: number) => String(n).padStart(2, "0");

export default async function Home() {
  const [s, projects, lab, skills, social] = await Promise.all([
    getSettings().catch(() => ({} as Record<string, any>)),
    getProjects().catch(() => []),
    getLab().catch(() => []),
    getSkills().catch(() => []),
    getSocial().catch(() => []),
  ]);
  const name = setting(s, "hero.name", "MD ABU TAWSIF");
  const descriptors = setting<string[]>(s, "hero.descriptors", ["AI systems", "Automation", "Software"]);
  const bio = setting(s, "about.bio", "I build systems that turn complicated processes into something that simply works.");
  const focus = setting<string[]>(s, "about.focus", ["AI", "Automation", "Software", "System design"]);
  const groups = [...new Set(skills.map((k) => k.group))];
  const ticker = [...new Set([...descriptors, "Python", "FastAPI", "n8n", "Claude", "Robotics", "Mathematics", ...skills.map((k) => k.name)])];
  const words = name.split(/\s+/);

  return (
    <>
      <nav className="panel mono" aria-label="Primary">
        <a href="#system">System</a><a href="#work">Work</a>
        {lab.length > 0 && <a href="#lab">Lab</a>}
        <a href="#about">About</a><a href="#contact">Contact</a>
        <ThemeToggle />
      </nav>

      <header id="system" className="hero">
        <div className="beam" />
        <div className="wrap">
          <h1 aria-label={name}>
            {words.map((w) => <span className="w" key={w}><Scramble text={w} /></span>)}
          </h1>
          <div className="meta">
            <p className="lead">{descriptors.map((d) => <span key={d}>{d}</span>)}</p>
            <p className="mono">System 01 online</p>
          </div>
        </div>
        <svg className="instrument" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <line x1="200" y1="0" x2="200" y2="400" opacity=".2" /><line x1="0" y1="200" x2="400" y2="200" opacity=".2" />
          <g className="ring r1"><circle cx="200" cy="200" r="188" strokeDasharray="2 9" /></g>
          <g className="ring r2"><circle cx="200" cy="200" r="140" strokeDasharray="44 12 4 12" />
            {[[200, 60], [340, 200], [200, 340], [60, 200]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 4} y={y - 4} width="8" height="8" fill="var(--bg)" />)}
          </g>
          <g className="ring r3"><circle cx="200" cy="200" r="92" strokeDasharray="1 6" /></g>
          <rect className="core" x="182" y="182" width="36" height="36" />
          <text x="200" y="16" textAnchor="middle">DATA</text><text x="392" y="203" textAnchor="end">INTEL</text>
          <text x="200" y="394" textAnchor="middle">AUTOMATION</text><text x="8" y="203">EXEC</text>
        </svg>
        <span className="scrollcue mono">Scroll</span>
      </header>

      <div className="ticker mono" aria-hidden>
        <div>{[...ticker, ...ticker].map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>

      <section id="work">
        <div className="wrap">
          <div className="sh"><h2 data-r="h">Work</h2><i /><span className="mono">{projects.length} systems</span></div>
          {projects.length === 0 && <p className="mono">No published systems yet.</p>}
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="sys" data-r="row">
              <span className="mono">Sys {pad(p.systemNumber ?? p.sortOrder + 1)}</span>
              <div>
                <h3>{p.name}</h3>
                <p className="mono cat">{p.category}</p>
              </div>
              <span className="st mono"><span><i className={`dot ${p.status === "live" ? "live" : ""}`} />{p.status.replace("_", " ")}</span><span className="go">Inspect</span></span>
            </Link>
          ))}
        </div>
      </section>

      {lab.length > 0 && (
        <section id="lab"><div className="wrap">
          <div className="sh"><h2 data-r="h">Lab</h2><i /><span className="mono">Unfinished by design</span></div>
          <div className="lab" data-r="row">
            {lab.map((l) => (
              <article key={l.id}>
                <p className="mono">{l.kind}</p><h3>{l.title}</h3>
                <p className="b">{l.body}</p>
                {l.mediaUrl && <img src={l.mediaUrl} alt="" loading="lazy" />}
              </article>
            ))}
          </div>
        </div></section>
      )}

      <section id="about"><div className="wrap">
        <div className="sh"><h2 data-r="h">About</h2><i /></div>
        <p className="bio" data-r="row">{bio}</p>
        <p className="focus" data-r="row">{focus.map((f) => <span key={f}>{f}</span>)}</p>
        {groups.map((g) => (
          <div key={g} style={{ marginTop: 44 }} data-r="row">
            <span className="mono">{g || "Other"}</span>
            <div className="chips">{skills.filter((k) => k.group === g).map((k) => <span className="chip" key={k.id}>{k.name}</span>)}</div>
          </div>
        ))}
      </div></section>

      <section id="contact"><div className="wrap" style={{ maxWidth: 680 }}>
        <div className="sh"><h2 data-r="h">Contact</h2><i /></div>
        <ContactForm />
        <p className="socials mono">
          {social.map((l) => <a key={l.id} href={l.url} rel="noopener noreferrer" target="_blank">{l.label}</a>)}
        </p>
      </div></section>
    </>
  );
}
