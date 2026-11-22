"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const ITEMS = [["/", "System"], ["/work", "Work"], ["/lab", "Lab"], ["/about", "About"], ["/contact", "Contact"]];

export default function Nav() {
  const path = usePathname();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <>
      <nav className="panel mono" aria-label="Primary">
        {ITEMS.map(([h, l]) => (
          <Link key={h} href={h} aria-current={active(h) ? "page" : undefined}>{l}</Link>
        ))}
      </nav>
      <ThemeToggle />
    </>
  );
}
