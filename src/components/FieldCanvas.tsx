"use client";
import { useEffect, useRef } from "react";

// One fixed canvas behind the site. Day/Night: a quiet dot lattice that parts around the cursor.
// Field: the lattice becomes a flow field of vectors that swirls around the cursor and around
// whichever project row you hover. Pauses when the tab is hidden; static for reduced motion.
export default function FieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = matchMedia("(pointer: coarse)").matches ? 46 : 30;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);

    let w = 0, h = 0, pts: { x: number; y: number }[] = [];
    let mx = -9999, my = -9999, tx = -9999, ty = -9999;
    let attrEl: Element | null = null;
    let raf = 0, field = false, dim = "#888", acc = "#fff";
    let hero: HTMLElement | null = null;

    const readTheme = () => {
      const s = getComputedStyle(root);
      dim = s.getPropertyValue("--dot").trim() || "#888";
      acc = s.getPropertyValue("--accent").trim() || "#fff";
      field = root.dataset.theme === "field";
    };
    const resize = () => {
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push({ x, y });
    };

    const draw = (t: number) => {
      mx += (tx - mx) * 0.16; my += (ty - my) * 0.16;
      ctx.clearRect(0, 0, w, h);
      const sy = scrollY * 0.001;
      const R = field ? 260 : 190, R2 = R * R;
      let ax = 0, ay = 0, hasA = false;
      if (attrEl && attrEl.isConnected) {
        const r = attrEl.getBoundingClientRect();
        ax = r.left + r.width / 2; ay = r.top + r.height / 2; hasA = true;
      }
      const pd = new Path2D(), pa = new Path2D();

      for (const p of pts) {
        const wave = Math.sin(p.x * 0.007 + t * 0.0004 + sy * 6) + Math.cos(p.y * 0.008 - t * 0.0003 - sy * 4);
        let vx = Math.cos(wave * 1.4), vy = Math.sin(wave * 1.4);
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        let f = 0;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1; f = (1 - d / R) ** 2;
          if (field) { vx += (-dy / d) * f * 2.4; vy += (dx / d) * f * 2.4; }
        }
        let a = 0;
        if (hasA) {
          const ex = p.x - ax, ey = p.y - ay, ed = Math.hypot(ex, ey) || 1;
          if (ed < 560) { a = (1 - ed / 560) ** 2; if (field) { vx += (-ey / ed) * a * 3; vy += (ex / ed) * a * 3; } }
        }
        const k = f + a, target = k > 0.14 ? pa : pd;

        if (field) {
          const ang = Math.atan2(vy, vx), len = 5 + 16 * k + 2.5 * Math.abs(wave);
          const ux = Math.cos(ang) * len / 2, uy = Math.sin(ang) * len / 2;
          target.moveTo(p.x - ux, p.y - uy); target.lineTo(p.x + ux, p.y + uy);
        } else {
          const d = Math.sqrt(d2) || 1;
          const ox = (dx / d) * f * 34 + Math.cos(wave) * 1.5, oy = (dy / d) * f * 34 + Math.sin(wave) * 1.5;
          const s = 1.5 + k * 2.2;
          target.rect(p.x + ox - s / 2, p.y + oy - s / 2, s, s);
        }
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = dim; ctx.fillStyle = dim;
      ctx.globalAlpha = field ? 0.55 : 1;
      field ? ctx.stroke(pd) : ctx.fill(pd);
      ctx.strokeStyle = acc; ctx.fillStyle = acc; ctx.globalAlpha = 0.95;
      field ? ctx.stroke(pa) : ctx.fill(pa);
    };

    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

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
    if (reduce) draw(0);
    const mo = new MutationObserver(() => { readTheme(); if (reduce) draw(0); });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(() => { resize(); if (reduce) draw(0); }, 150); };

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
