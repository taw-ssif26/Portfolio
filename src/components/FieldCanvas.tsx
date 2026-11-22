"use client";
import { useEffect, useRef } from "react";

/*
  One fixed canvas behind the site, two renderers:
  - Day / Night: a quiet dot lattice that parts around the cursor.
  - Field: a pseudo-3D laboratory corridor. Scrolling walks you down it, the cursor turns your head,
    hovering a project energises the lab and locks a targeting frame onto it.
  Pauses when hidden. Reduced motion gets one static frame.
*/

const FAR = 3600, NEAR = 50, W = 380, H = 250, RIB = 450, CROSS = 150;
const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// wireframes (unit coordinates)
const CUBE_V: number[][] = []; for (let i = 0; i < 8; i++) CUBE_V.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]);
const CUBE_E: number[][] = []; for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const d = i ^ j; if (d === 1 || d === 2 || d === 4) CUBE_E.push([i, j]); }
const OCTA_V = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const OCTA_E: number[][] = []; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) if (i >> 1 !== j >> 1) OCTA_E.push([i, j]);
const RING_V: number[][] = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; RING_V.push([Math.cos(a), Math.sin(a), 0]); }
for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; RING_V.push([Math.cos(a), 0, Math.sin(a)]); }
const RING_E: number[][] = []; for (let i = 0; i < 24; i++) { RING_E.push([i, (i + 1) % 24]); RING_E.push([24 + i, 24 + ((i + 1) % 24)]); }
const SHAPES = [{ v: CUBE_V, e: CUBE_E }, { v: OCTA_V, e: OCTA_E }, { v: RING_V, e: RING_E }];

const OBJS = Array.from({ length: 9 }, (_, i) => ({
  base: (i / 9) * 3600 + hash(i, 1) * 200,
  x: (i % 2 ? 1 : -1) * (120 + hash(i, 2) * 140),
  y: (hash(i, 3) - 0.5) * 320,
  s: 34 + hash(i, 4) * 38,
  kind: i % 3,
  sp: 0.6 + hash(i, 5),
}));

// long edges of the corridor (x,y pairs); floor, ceiling, walls
const LONG: number[][] = [];
for (let x = -W; x <= W; x += 95) { LONG.push([x, H]); LONG.push([x, -H]); }
for (let y = -H + 125; y < H; y += 125) { LONG.push([-W, y]); LONG.push([W, y]); }

export default function FieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const gap = coarse ? 46 : 30;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const NP = coarse ? 60 : 150;
    const PARTS = Array.from({ length: NP }, (_, i) => ({
      x: (hash(i, 7) - 0.5) * W * 1.9, y: (hash(i, 8) - 0.5) * H * 1.9, z: hash(i, 9) * FAR,
    }));

    let w = 0, h = 0, pts: { x: number; y: number }[] = [];
    let mx = -9999, my = -9999, tx = -9999, ty = -9999;
    let attrEl: Element | null = null;
    let raf = 0, last = 0, lastHud = 0;
    let field = false, dim = "#888", acc = "#fff", acc2 = "#0ff", fg = "#fff";
    let hero: HTMLElement | null = null;
    // field-mode state
    let cam = 0, drift = 0, vel = 0, warp = 0, energy = 0, lx = 0, ly = 0, focal = 800, cx = 0, cy = 0, camX = 0, camY = 0;

    const readTheme = () => {
      const s = getComputedStyle(root);
      dim = s.getPropertyValue("--dot").trim() || "#888";
      acc = s.getPropertyValue("--accent").trim() || "#fff";
      acc2 = s.getPropertyValue("--accent2").trim() || acc;
      fg = s.getPropertyValue("--fg").trim() || "#fff";
      const was = field;
      field = root.dataset.theme === "field";
      if (field && !was) warp = 1; // walk-in burst
    };
    const resize = () => {
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push({ x, y });
    };

    /* ---------- lattice (day / night) ---------- */
    const drawLattice = (t: number) => {
      mx += (tx - mx) * 0.16; my += (ty - my) * 0.16;
      ctx.clearRect(0, 0, w, h);
      const sy = scrollY * 0.001, R = 190, R2 = R * R;
      const pd = new Path2D(), pa = new Path2D();
      for (const p of pts) {
        const wave = Math.sin(p.x * 0.007 + t * 0.0004 + sy * 6) + Math.cos(p.y * 0.008 - t * 0.0003 - sy * 4);
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        let f = 0; const d = Math.sqrt(d2) || 1;
        if (d2 < R2) f = (1 - d / R) ** 2;
        const ox = (dx / d) * f * 34 + Math.cos(wave) * 1.5, oy = (dy / d) * f * 34 + Math.sin(wave) * 1.5;
        const s = 1.5 + f * 2.2;
        (f > 0.14 ? pa : pd).rect(p.x + ox - s / 2, p.y + oy - s / 2, s, s);
      }
      ctx.fillStyle = dim; ctx.fill(pd);
      ctx.fillStyle = acc; ctx.fill(pa);
    };

    /* ---------- laboratory corridor (field) ---------- */
    const A = { x: 0, y: 0 }, B = { x: 0, y: 0 };
    const proj = (x: number, y: number, z: number, o: { x: number; y: number }) => {
      const dz = z - cam;
      if (dz < NEAR) return false;
      const s = focal / dz;
      o.x = cx + (x - camX) * s; o.y = cy + (y - camY) * s;
      return true;
    };
    const fog = (dz: number) => { const k = 1 - dz / FAR; return k <= 0 ? 0 : k * k; };
    const line = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      if (proj(x1, y1, z1, A) && proj(x2, y2, z2, B)) { ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); }
    };
    const quad = (p: number[][]) => {
      const pts4: { x: number; y: number }[] = [];
      for (const q of p) { const o = { x: 0, y: 0 }; if (!proj(q[0], q[1], q[2], o)) return false; pts4.push(o); }
      ctx.moveTo(pts4[0].x, pts4[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(pts4[i].x, pts4[i].y);
      ctx.closePath(); return true;
    };

    const drawField = (t: number, dt: number) => {
      // camera: scroll walks forward, a slow idle drift keeps it alive, cursor turns the head
      drift += dt * 0.045;
      const prev = cam;
      cam += (scrollY * 2.4 + drift - cam) * Math.min(1, dt * 0.006);
      vel = vel * 0.88 + ((cam - prev) / Math.max(dt, 1)) * 1000 * 0.12;
      warp *= Math.pow(0.5, dt / 500);
      energy += ((attrEl ? 1 : 0) - energy) * Math.min(1, dt * 0.006);
      const tlx = tx > -9000 ? tx / w - 0.5 : 0, tly = ty > -9000 ? ty / h - 0.5 : 0;
      lx += (tlx - lx) * Math.min(1, dt * 0.005); ly += (tly - ly) * Math.min(1, dt * 0.005);
      const speed = Math.abs(vel) + warp * 3800;
      focal = h * 0.95 * (1 - 0.4 * warp);
      camX = lx * 70; camY = Math.sin(cam * 0.014) * 4 * clamp(Math.abs(vel) / 500, 0, 1);
      cx = w / 2 - lx * w * 0.09; cy = h / 2 - ly * h * 0.07;
      const E = 1 + energy * 0.7;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2); ctx.rotate(lx * 0.025 + Math.sin(t * 0.0004) * 0.003 + clamp(vel, -1500, 1500) * 0.000002 * lx); ctx.translate(-w / 2, -h / 2);
      ctx.lineJoin = "round";

      // long edges, drawn in depth slices so fog can fade them
      ctx.strokeStyle = acc; ctx.lineWidth = 1;
      const CH = 16;
      for (let i = 0; i < CH; i++) {
        const z0 = cam + NEAR + (FAR - NEAR) * (i / CH) ** 1.8, z1 = cam + NEAR + (FAR - NEAR) * ((i + 1) / CH) ** 1.8;
        const a = fog((z0 + z1) / 2 - cam) * 0.5 * E; if (a < 0.01) continue;
        ctx.globalAlpha = Math.min(1, a); ctx.beginPath();
        for (const [x, y] of LONG) line(x, y, z0, x, y, z1);
        ctx.stroke();
      }

      // cross lines + ribs
      const k0 = Math.ceil((cam + NEAR) / CROSS), k1 = Math.floor((cam + FAR) / CROSS);
      for (let k = k0; k <= k1; k++) {
        const z = k * CROSS, dz = z - cam, a = fog(dz);
        if (a < 0.01) continue;
        const rib = k % 3 === 0;
        ctx.beginPath();
        line(-W, H, z, W, H, z); line(-W, -H, z, W, -H, z);
        if (rib) { line(-W, -H, z, -W, H, z); line(W, -H, z, W, H, z); }
        ctx.strokeStyle = acc; ctx.lineWidth = rib ? 2 : 1;
        ctx.globalAlpha = Math.min(1, a * (rib ? 0.95 : 0.3) * E); ctx.stroke();
      }

      // ceiling light strips + wall panels live between ribs
      const r0 = Math.ceil((cam + NEAR - RIB) / RIB), r1 = Math.floor((cam + FAR) / RIB);
      for (let kr = r0; kr <= r1; kr++) {
        const z = kr * RIB, a = fog(z + RIB / 2 - cam);
        if (a < 0.02) continue;
        // light strip
        const on = hash(kr, Math.floor(t / 700)) > 0.07;
        if (on) {
          ctx.beginPath();
          if (quad([[-34, -H + 2, z + 110], [34, -H + 2, z + 110], [34, -H + 2, z + 340], [-34, -H + 2, z + 340]])) {
            ctx.fillStyle = fg; ctx.globalAlpha = Math.min(1, a * 0.55 * E); ctx.fill();
          }
        }
        // wall panel
        const left = kr % 2 === 0, x = left ? -W : W, yt = -H * 0.62, yb = -H * 0.06, zs = z + 70, ze = z + 380;
        ctx.strokeStyle = acc2; ctx.fillStyle = acc2; ctx.lineWidth = 1;
        ctx.beginPath(); quad([[x, yt, zs], [x, yt, ze], [x, yb, ze], [x, yb, zs]]);
        ctx.globalAlpha = Math.min(1, a * 0.7); ctx.stroke();
        if (left || kr % 4 === 1) {
          // spectrum analyser
          const n = 14, bw = (ze - zs) / n;
          ctx.beginPath();
          for (let b = 0; b < n; b++) {
            const f = 0.2 + 0.8 * Math.abs(Math.sin(t * 0.0016 + b * 0.62 + kr * 1.7));
            const top = yb - f * (yb - yt) * 0.92;
            quad([[x, top, zs + b * bw + 3], [x, top, zs + (b + 1) * bw - 3], [x, yb - 2, zs + (b + 1) * bw - 3], [x, yb - 2, zs + b * bw + 3]]);
          }
          ctx.globalAlpha = Math.min(1, a * 0.5 * E); ctx.fill();
        } else {
          // scrolling readout rows
          ctx.beginPath();
          for (let r = 0; r < 6; r++) {
            const y = yt + ((r + 1) / 7) * (yb - yt), tick = Math.floor(t / 520 + r * 3);
            const len = (0.25 + hash(kr + r, tick) * 0.7) * (ze - zs);
            line(x, y, zs + 8, x, y, zs + 8 + len);
          }
          ctx.lineWidth = 2; ctx.globalAlpha = Math.min(1, a * 0.7 * E); ctx.stroke();
        }
      }

      // scanner frame sweeping toward you
      const zs2 = cam + NEAR + (FAR - ((t * 0.0009 * (1 + energy * 1.5) * FAR) % (FAR - NEAR)));
      for (let g = 0; g < 4; g++) {
        const z = zs2 + g * 70, a = fog(z - cam) * (1 - g * 0.25);
        if (a < 0.02) continue;
        ctx.beginPath(); quad([[-W, -H, z], [W, -H, z], [W, H, z], [-W, H, z]]);
        ctx.strokeStyle = acc2; ctx.lineWidth = g === 0 ? 2.5 : 1; ctx.globalAlpha = Math.min(1, a * 1.2); ctx.stroke();
      }

      // floating wireframes
      ctx.lineWidth = 1.3;
      const px: number[] = [], py: number[] = [], ok: boolean[] = [];
      for (let i = 0; i < OBJS.length; i++) {
        const o = OBJS[i], z = cam + 150 + ((((o.base - cam - 150) % 3600) + 3600) % 3600), a = fog(z - cam);
        if (a < 0.03) continue;
        const sh = SHAPES[o.kind], ar = t * 0.0005 * o.sp, br = t * 0.0003 * o.sp;
        const ca = Math.cos(ar), sa = Math.sin(ar), cb = Math.cos(br), sb = Math.sin(br);
        const P = { x: 0, y: 0 };
        for (let v = 0; v < sh.v.length; v++) {
          const [vx, vy, vz] = sh.v[v];
          const x1 = vx * ca + vz * sa; let z1 = -vx * sa + vz * ca;
          const y1 = vy * cb - z1 * sb; z1 = vy * sb + z1 * cb;
          ok[v] = proj(o.x + x1 * o.s, o.y + y1 * o.s, z + z1 * o.s, P); px[v] = P.x; py[v] = P.y;
        }
        ctx.beginPath();
        for (const [e0, e1] of sh.e) if (ok[e0] && ok[e1]) { ctx.moveTo(px[e0], py[e0]); ctx.lineTo(px[e1], py[e1]); }
        ctx.strokeStyle = i % 2 ? acc2 : acc; ctx.globalAlpha = Math.min(1, a * 1.3 * E); ctx.stroke();
      }

      // motes / speed streaks
      ctx.strokeStyle = fg; ctx.fillStyle = fg; ctx.lineWidth = 1;
      ctx.beginPath();
      const streak = clamp(speed * 0.018, 0, 900) * Math.sign(vel || 1);
      for (const p of PARTS) {
        const z = cam + NEAR + ((((p.z - cam - NEAR) % FAR) + FAR) % FAR);
        const a = fog(z - cam); if (a < 0.03) continue;
        if (proj(p.x, p.y, z, A)) {
          if (Math.abs(streak) > 6 && proj(p.x, p.y, z + Math.abs(streak), B)) { ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); }
          else ctx.rect(A.x - 0.7, A.y - 0.7, 1.4, 1.4);
        }
      }
      ctx.globalAlpha = 0.55 + warp * 0.4; ctx.stroke(); ctx.fill();
      ctx.restore();

      // target lock on hovered project (screen space)
      if (attrEl && attrEl.isConnected) {
        const r = attrEl.getBoundingClientRect(), inset = (1 - energy) * 36, L = 20;
        const x0 = r.left - inset, y0 = r.top - inset, x1 = r.right + inset, y1 = r.bottom + inset;
        ctx.globalAlpha = clamp(energy * 1.4, 0, 1); ctx.strokeStyle = acc; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(x0, y0 + L); ctx.lineTo(x0, y0); ctx.lineTo(x0 + L, y0);
        ctx.moveTo(x1 - L, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + L);
        ctx.moveTo(x0, y1 - L); ctx.lineTo(x0, y1); ctx.lineTo(x0 + L, y1);
        ctx.moveTo(x1 - L, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - L);
        ctx.stroke();
        ctx.fillStyle = acc; ctx.font = "10px monospace"; ctx.fillText("TARGET LOCK", x0 + 4, y0 - 8);
      }
      ctx.globalAlpha = 1;

      // telemetry
      const ruler = document.querySelector<HTMLElement>(".ruler");
      if (ruler) ruler.style.backgroundPositionY = `${(-cam * 0.25) % 20}px`;
    };

    /* ---------- loop ---------- */
    const frame = (t: number) => {
      const dt = clamp(t - (last || t), 1, 64); last = t;
      field ? drawField(t, dt) : drawLattice(t);
      if (t - lastHud > 120) {
        lastHud = t;
        const z = document.getElementById("hud-z");
        if (z) z.textContent = field ? `DEPTH ${(cam / 100).toFixed(1)}M  VEL ${(Math.abs(vel) / 100).toFixed(1)}` : `ENV ${root.dataset.theme}`;
      }
    };
    const loop = (t: number) => { frame(t); raf = requestAnimationFrame(loop); };
    const start = () => { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const still = () => { drift = 0; cam = 0; field ? drawField(0, 16) : drawLattice(0); };

    const heroEl = () => (hero && hero.isConnected ? hero : (hero = document.querySelector<HTMLElement>(".hero")));
    const pad = (n: number) => String(Math.round(n)).padStart(4, "0");

    const onMove = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (mx < -9000) { mx = tx; my = ty; }
      const el = heroEl();
      if (el) { el.style.setProperty("--mx", String((tx / w - 0.5) * 2)); el.style.setProperty("--my", String((ty / h - 0.5) * 2)); }
      const xy = document.getElementById("hud-xy");
      if (xy) xy.textContent = `X ${pad(tx)}  Y ${pad(ty)}`;
      const row = (e.target as Element).closest?.(".sys") as HTMLElement | null;
      if (row) {
        const r = row.getBoundingClientRect();
        row.style.setProperty("--px", e.clientX - r.left + "px"); row.style.setProperty("--py", e.clientY - r.top + "px");
      }
    };
    const onOver = (e: PointerEvent) => { attrEl = (e.target as Element).closest?.(".sys") ?? null; };
    const onScroll = () => { heroEl()?.style.setProperty("--sy", String(Math.min(1, scrollY / innerHeight))); };
    const onVis = () => (document.hidden ? stop() : start());

    readTheme(); resize();
    if (reduce) still();
    const mo = new MutationObserver(() => { readTheme(); if (reduce) still(); });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(() => { resize(); if (reduce) still(); }, 150); };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerover", onOver, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      stop(); mo.disconnect();
      removeEventListener("pointermove", onMove); removeEventListener("pointerover", onOver);
      removeEventListener("scroll", onScroll); removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden />;
}
