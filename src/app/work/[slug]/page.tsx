import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject } from "@/lib/content";
import Motif from "@/components/Motif";
import PageNext from "@/components/PageNext";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300; // safety net if a tag revalidation is ever missed

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug).catch(() => null);
  return p ? { title: `${p.name} — Md Abu Tawsif`, description: p.tagline } : {};
}

export default async function Project({ params }: Props) {
  const p = await getProject((await params).slug).catch(() => null);
  if (!p) notFound();

  const steps: [string, string, React.ReactNode][] = [
    ["01", "Problem", <p key="a">{p.problem}</p>],
    ["02", "System", <p key="b">{p.solution}</p>],
    ["03", "Architecture", (
      <div key="c" className="arch">
        {p.architecture.map((n, i) => (
          <div key={n.id} className="node" style={{ ["--i" as any]: i }}>
            <strong style={{ fontWeight: 500 }}>{n.label}</strong>
            {n.note && <p className="mono" style={{ marginTop: 6 }}>{n.note}</p>}
          </div>
        ))}
      </div>
    )],
    ["04", "Implementation", <p key="d">{p.implementation}</p>],
    ["05", "Result", (
      <div key="e">
        <p>{p.result}</p>
        {p.metrics.length > 0 && (
          <p className="mono" style={{ marginTop: 24, display: "flex", gap: 32, flexWrap: "wrap" }}>
            {p.metrics.map((m) => <span className="metric" key={m.label}>{m.label}<b>{m.value}</b></span>)}
          </p>
        )}
        {p.media.length > 0 && (
          <div className="media">
            {p.media.map((m) => m.kind === "video"
              ? <video key={m.id} src={m.url} controls preload="none" />
              : <img key={m.id} src={m.url} alt={m.alt} loading="lazy" />)}
          </div>
        )}
      </div>
    )],
    ["06", "Live system", (
      <p key="f" className="mono" style={{ display: "flex", gap: 24 }}>
        {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">Open ↗</a>}
        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">Source ↗</a>}
        {!p.liveUrl && !p.githubUrl && <span>Not public</span>}
      </p>
    )],
  ];

  return (
    <>
            <main className="page wrap" style={{ ["--hue" as any]: `var(--c${(p.sortOrder % 5) + 1})` }}>
        <p className="mono">SYS {String(p.systemNumber ?? p.sortOrder + 1).padStart(2, "0")} — {p.category}</p>
        <h1 className="big pj">{p.name}</h1>
        <div className="mhero"><Motif kind={p.visualType} /></div>
        <p className="mono"><i className={`dot ${p.status === "live" ? "live" : ""}`} />{p.status.replace("_", " ")}</p>
        <div style={{ marginTop: 80 }}>
          {steps.filter(([, , body]) => body).map(([n, t, body]) => (
            <section key={n} className="step" data-r="row">
              <p className="mono">{n} — {t}</p><div>{body}</div>
            </section>
          ))}
        </div>
        <PageNext href="/work" label="All work" hue={(p.sortOrder % 5) + 1} />
      </main>
      <Footer />
    </>
  );
}
