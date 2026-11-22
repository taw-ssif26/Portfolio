import { getSocial } from "@/lib/content";

export default async function Footer() {
  const social = await getSocial().catch(() => []);
  return (
    <footer className="foot wrap">
      <span className="mono">Md Abu Tawsif — AI systems / automation / software</span>
      <span className="mono socials">
        {social.map((l) => <a key={l.id} href={l.url} rel="noopener noreferrer" target="_blank">{l.label}</a>)}
      </span>
    </footer>
  );
}
