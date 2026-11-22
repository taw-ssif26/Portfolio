import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import ProjectTile from "@/components/ProjectTile";
import PageHead from "@/components/PageHead";
import PageNext from "@/components/PageNext";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Work — Md Abu Tawsif" };
export const revalidate = 300;

export default async function Work() {
  const projects = await getProjects().catch(() => []);
  return (
    <>
      <main className="page wrap">
        <PageHead kicker={`Project observatory — ${projects.length} systems`} title="Work" lead="Systems I designed, built and shipped. Open one to inspect how it works." />
        {projects.length === 0 && <p className="mono">No published systems yet.</p>}
        <div className="tiles">{projects.map((p, i) => <ProjectTile key={p.id} p={p} i={i} />)}</div>
        <PageNext href="/lab" label="The Lab" hue={2} />
      </main>
      <Footer />
    </>
  );
}
