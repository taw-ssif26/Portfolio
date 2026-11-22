import type { Metadata } from "next";
import { getSettings, getSkills, getExperience, setting } from "@/lib/content";
import PageHead from "@/components/PageHead";
import PageNext from "@/components/PageNext";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "About — Md Abu Tawsif" };
export const revalidate = 300;

export default async function About() {
  const [s, skills, exp] = await Promise.all([
    getSettings().catch(() => ({} as Record<string, any>)),
    getSkills().catch(() => []),
    getExperience().catch(() => []),
  ]);
  const bio = setting(s, "about.bio", "I build systems that turn complicated processes into something that simply works.");
  const focus = setting<string[]>(s, "about.focus", ["AI", "Automation", "Software", "System design"]);
  const groups = [...new Set(skills.map((k) => k.group))];

  return (
    <>
      <main className="page wrap">
        <PageHead kicker="Identity — Md Abu Tawsif" title="About" />
        <p className="bio" data-r="row">{bio}</p>
        <p className="focus" data-r="row">{focus.map((f, i) => <span key={f} style={{ ["--hue" as any]: `var(--c${(i % 5) + 1})` }}>{f}</span>)}</p>

        {groups.length > 0 && <h2 className="sub">Technology</h2>}
        {groups.map((g, gi) => (
          <div key={g} className="grp" data-r="row" style={{ ["--hue" as any]: `var(--c${(gi % 5) + 1})` }}>
            <span className="mono">{g || "Other"}</span>
            <div className="chips">{skills.filter((k) => k.group === g).map((k) => <span className="chip" key={k.id}>{k.name}</span>)}</div>
          </div>
        ))}

        {exp.length > 0 && <h2 className="sub">Experience & education</h2>}
        {exp.map((e, i) => (
          <div key={e.id} className="erow" data-r="row" style={{ ["--hue" as any]: `var(--c${(i % 5) + 1})` }}>
            <span className="mono">{[e.startDate, e.endDate].filter(Boolean).join(" — ") || e.type}</span>
            <div><h3>{e.title}</h3><p className="mono">{e.organization}</p></div>
            <p>{e.description}</p>
          </div>
        ))}
        <PageNext href="/contact" label="Contact" hue={4} />
      </main>
      <Footer />
    </>
  );
}
