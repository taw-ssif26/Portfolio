"use client";
import { useState } from "react";

export default function Login() {
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    if (r.ok) location.href = "/admin";
    else setErr(r.status === 429 ? "Too many attempts" : "Invalid credentials");
  }
  return (
    <main className="wrap" style={{ maxWidth: 420, paddingTop: 160 }}>
      <p className="mono" style={{ marginBottom: 32 }}>Authenticate</p>
      <form onSubmit={submit}>
        <label className="field"><span className="mono">Email</span><input name="email" type="email" required autoComplete="username" /></label>
        <label className="field"><span className="mono">Password</span><input name="password" type="password" required autoComplete="current-password" /></label>
        <button className="btn mono">Enter</button>
        {err && <p className="mono" role="alert" style={{ marginTop: 16, color: "var(--accent)" }}>{err}</p>}
      </form>
    </main>
  );
}
