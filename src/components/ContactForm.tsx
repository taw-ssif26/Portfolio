"use client";
import { useState } from "react";

const STAGES = ["INPUT", "ENCRYPT", "TRANSMIT", "RECEIVED"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ContactForm() {
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setError(""); setStage(0);
    const timer = (async () => { for (let i = 1; i <= 2; i++) { await sleep(500); setStage(i); } })();
    const res = await fetch("/api/contact", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data),
    }).catch(() => null);
    await timer;
    if (res?.ok) { setStage(3); form.reset(); }
    else { setStage(-1); setError(res?.status === 429 ? "Too many attempts. Try later." : "Transmission failed."); }
  }

  return (
    <form onSubmit={submit}>
      <label className="field"><span className="mono">Name</span><input name="name" required maxLength={100} /></label>
      <label className="field"><span className="mono">Email</span><input name="email" type="email" required /></label>
      <label className="field"><span className="mono">Message</span><textarea name="message" rows={4} required minLength={5} maxLength={5000} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: "-9999px" }} />
      <button className="btn mono" disabled={stage >= 0 && stage < 3}>Establish connection</button>
      {stage >= 0 && (
        <div className="pipe mono" role="status">
          {STAGES.map((s, i) => <span key={s} className={i <= stage ? "on" : ""}>{s}</span>)}
        </div>
      )}
      {error && <p className="mono" role="alert" style={{ marginTop: 16, color: "var(--accent)" }}>{error}</p>}
    </form>
  );
}
