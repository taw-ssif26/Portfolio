import type { Metadata } from "next";
import { getLab } from "@/lib/content";
import PageHead from "@/components/PageHead";
import PageNext from "@/components/PageNext";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Lab — Md Abu Tawsif" };
export const revalidate = 300;

export default async function Lab() {
  const lab = await getLab().catch(() => []);
  return (
    <>
      <main className="page wrap">
        <PageHead kicker="Unfinished by design" title="The Lab" lead="Prototypes, experiments and half-formed ideas. The workshop behind the finished products." />
        {lab.length === 0 && <p className="mono">The lab is empty for now.</p>}
        <div className="labgrid">
          {lab.map((l, i) => (
            <article key={l.id} className="lcard tilt" style={{ ["--hue" as any]: `var(--c${(i % 5) + 1})` }} data-r="row">
              <span className="glare" />
              <p className="mono">{l.kind}</p><h3>{l.title}</h3>
              <p className="b">{l.body}</p>
              {l.mediaUrl && <img src={l.mediaUrl} alt="" loading="lazy" />}
            </article>
          ))}
        </div>
        <PageNext href="/about" label="About" hue={3} />
      </main>
      <Footer />
    </>
  );
}
