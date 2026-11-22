"use client";
import { useCallback, useEffect, useState } from "react";

type F = { k: string; t?: "area" | "json" | "number" | "bool" | "select" | "upload"; o?: string[]; nullable?: boolean };
type R = { label: string; title: string; fields: F[] };

const STATUS = ["live", "beta", "in_development", "prototype", "archived"];
const VISUAL = ["default", "conversation", "flow", "sensor", "geometry", "architecture"];

// Add a field here and the editor + API handle it. Column must exist in schema.ts.
const RES: Record<string, R> = {
  projects: { label: "Projects", title: "name", fields: [
    { k: "slug" }, { k: "name" }, { k: "systemNumber", t: "number" }, { k: "category" }, { k: "tagline" },
    { k: "problem", t: "area" }, { k: "solution", t: "area" }, { k: "implementation", t: "area" }, { k: "result", t: "area" },
    { k: "architecture", t: "json" }, { k: "metrics", t: "json" },
    { k: "status", t: "select", o: STATUS }, { k: "visualType", t: "select", o: VISUAL },
    { k: "liveUrl", nullable: true }, { k: "githubUrl", nullable: true },
    { k: "featured", t: "bool" }, { k: "published", t: "bool" } ] },
  "project-media": { label: "Project media", title: "url", fields: [
    { k: "projectId", t: "number" }, { k: "kind", t: "select", o: ["image", "video"] },
    { k: "url", t: "upload" }, { k: "alt" }, { k: "caption", nullable: true } ] },
  lab: { label: "Lab", title: "title", fields: [
    { k: "title" }, { k: "kind", t: "select", o: ["note", "simulation", "prototype", "research"] },
    { k: "body", t: "area" }, { k: "mediaUrl", t: "upload", nullable: true }, { k: "published", t: "bool" } ] },
  skills: { label: "Skills", title: "name", fields: [{ k: "slug" }, { k: "name" }, { k: "group" }] },
  "skill-links": { label: "Skill links", title: "id", fields: [{ k: "fromSkillId", t: "number" }, { k: "toSkillId", t: "number" }] },
  experience: { label: "Experience", title: "title", fields: [
    { k: "type", t: "select", o: ["work", "education"] }, { k: "title" }, { k: "organization" },
    { k: "startDate", nullable: true }, { k: "endDate", nullable: true }, { k: "description", t: "area" } ] },
  social: { label: "Social links", title: "label", fields: [{ k: "label" }, { k: "url" }] },
};

// Settings are JSON values keyed by name. Strings must be valid JSON, e.g. "Text" or ["A","B"].
const SETTING_KEYS = ["hero.name", "hero.descriptors", "about.bio", "about.focus", "seo.title", "seo.description"];

export default function Admin() {
  const [tab, setTab] = useState("projects");
  return (
    <div className="adm">
      <nav>
        <p className="mono" style={{ marginBottom: 16 }}>Control</p>
        {Object.entries(RES).map(([k, v]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{v.label}</button>
        ))}
        <button className={tab === "settings" ? "on" : ""} onClick={() => setTab("settings")}>Site settings</button>
        <a className="mono" href="/" style={{ display: "block", padding: 8, marginTop: 24 }}>View site ↗</a>
      </nav>
      {tab === "settings" ? <Settings /> : <Editor key={tab} res={tab} />}
    </div>
  );
}

function Editor({ res }: { res: string }) {
  const cfg = RES[res];
  const [rows, setRows] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/${res}`);
    if (r.status === 401) { location.href = "/admin/login"; return; }
    setRows(await r.json());
  }, [res]);
  useEffect(() => { load(); }, [load]);

  const edit = (row?: any) => {
    const v: any = { id: row?.id };
    for (const f of cfg.fields) {
      const x = row?.[f.k];
      v[f.k] = f.t === "json" ? JSON.stringify(x ?? [], null, 2) : f.t === "bool" ? !!x : x ?? (f.t === "select" ? f.o![0] : "");
    }
    setSel(v); setMsg("");
  };

  async function save() {
    const body: any = {};
    try {
      for (const f of cfg.fields) {
        let x = sel[f.k];
        if (f.t === "json") x = JSON.parse(x || "[]");
        else if (f.t === "number") x = x === "" ? null : Number(x);
        else if (x === "" && f.nullable) x = null;
        body[f.k] = x;
      }
    } catch { setMsg("Invalid JSON"); return; }
    const r = await fetch(sel.id ? `/api/admin/${res}/${sel.id}` : `/api/admin/${res}`, {
      method: sel.id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
    });
    if (!r.ok) { setMsg("Error: " + (await r.text())); return; }
    const saved = await r.json(); await load(); edit(saved); setMsg("Saved");
  }

  async function del() {
    if (!sel?.id || !confirm("Delete permanently?")) return;
    await fetch(`/api/admin/${res}/${sel.id}`, { method: "DELETE" });
    setSel(null); load();
  }

  async function move(i: number, d: number) {
    const ids = rows.map((r) => r.id); const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await fetch("/api/admin/reorder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resource: res, ids }) });
    load();
  }

  async function upload(k: string, file: File) {
    setMsg("Uploading…");
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error); return; }
    setSel((s: any) => ({ ...s, [k]: j.url })); setMsg("Uploaded. Save to apply.");
  }

  return (
    <>
      <div>
        <button className="row" onClick={() => edit()}>+ New</button>
        {rows.map((r, i) => (
          <div key={r.id} style={{ display: "flex" }}>
            <button className={`row ${sel?.id === r.id ? "on" : ""}`} onClick={() => edit(r)}>{String(r[cfg.title])}</button>
            {rows[0]?.sortOrder !== undefined && <>
              <button aria-label="Move up" style={{ width: 28 }} onClick={() => move(i, -1)}>↑</button>
              <button aria-label="Move down" style={{ width: 28 }} onClick={() => move(i, 1)}>↓</button>
            </>}
          </div>
        ))}
      </div>
      <div>
        {!sel ? <p className="mono">Select or create</p> : (
          <>
            {cfg.fields.map((f) => (
              <label key={f.k}>
                <span className="mono">{f.k}</span>
                {f.t === "bool" ? <input type="checkbox" checked={sel[f.k]} onChange={(e) => setSel({ ...sel, [f.k]: e.target.checked })} style={{ marginLeft: 8 }} />
                  : f.t === "area" || f.t === "json" ? <textarea value={sel[f.k]} onChange={(e) => setSel({ ...sel, [f.k]: e.target.value })} />
                  : f.t === "select" ? <select value={sel[f.k]} onChange={(e) => setSel({ ...sel, [f.k]: e.target.value })}>{f.o!.map((o) => <option key={o}>{o}</option>)}</select>
                  : <>
                      <input type={f.t === "number" ? "number" : "text"} value={sel[f.k] ?? ""} onChange={(e) => setSel({ ...sel, [f.k]: e.target.value })} />
                      {f.t === "upload" && <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(f.k, e.target.files[0])} />}
                    </>}
              </label>
            ))}
            <button className="btn mono" onClick={save}>Save</button>{" "}
            {sel.id && <button className="btn mono" style={{ background: "transparent", color: "var(--fg)", border: "1px solid var(--line)" }} onClick={del}>Delete</button>}
            <p className="mono" style={{ marginTop: 12 }}>{msg}</p>
          </>
        )}
      </div>
    </>
  );
}

function Settings() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((s) =>
      setVals(Object.fromEntries(SETTING_KEYS.map((k) => [k, s[k] === undefined ? "" : JSON.stringify(s[k])]))));
  }, []);
  async function save(k: string) {
    let value; try { value = JSON.parse(vals[k]); } catch { setMsg(`${k}: invalid JSON (wrap text in quotes)`); return; }
    const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: k, value }) });
    setMsg(r.ok ? `${k} saved` : "Error");
  }
  return (
    <>
      <div />
      <div style={{ gridColumn: "span 1" }}>
        {SETTING_KEYS.map((k) => (
          <label key={k}><span className="mono">{k}</span>
            <textarea value={vals[k] ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
            <button className="btn mono" style={{ marginTop: 6 }} onClick={() => save(k)}>Save</button>
          </label>
        ))}
        <p className="mono">{msg}</p>
      </div>
    </>
  );
}
