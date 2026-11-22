import Split from "./Split";

export default function PageHead({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <header className="phead">
      <p className="mono">{kicker}</p>
      <Split as="h1" text={title} className="ptitle" />
      {lead && <p className="lead" data-r="row">{lead}</p>}
    </header>
  );
}
