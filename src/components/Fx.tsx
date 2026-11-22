"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { playShift } from "@/lib/shift";

// Reveals, wipe transitions between pages, 3D tilt on cards, magnetic buttons.
export default function Fx() {
  const path = usePathname();
  const router = useRouter();

  // reveals
  useEffect(() => {
    const els = document.querySelectorAll("[data-r]");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);

  // internal links get the colour wipe (capture phase so it runs before Next's own handler)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || "noshift" in a.dataset) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      e.preventDefault(); e.stopPropagation();
      playShift(() => router.push(u.pathname + u.search + u.hash));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // tilt + magnetic (fine pointers only)
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let busy = false;
    const move = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.(".tilt") as HTMLElement | null;
      if (t) {
        const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        t.style.setProperty("--rx", (0.5 - y) * 7 + "deg"); t.style.setProperty("--ry", (x - 0.5) * 9 + "deg");
        t.style.setProperty("--gx", x * 100 + "%"); t.style.setProperty("--gy", y * 100 + "%");
      }
      if (busy) return; busy = true;
      requestAnimationFrame(() => {
        busy = false;
        document.querySelectorAll<HTMLElement>(".mag").forEach((el) => {
          const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9 ? `translate(${dx * 0.25}px,${dy * 0.25}px)` : "";
        });
      });
    };
    const out = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.(".tilt") as HTMLElement | null;
      if (t && !t.contains(e.relatedTarget as Node)) { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); }
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", out); };
  }, []);

  return <><div id="shift" aria-hidden /><div id="shift2" aria-hidden /></>;
}
