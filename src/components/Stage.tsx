"use client";
import { usePathname } from "next/navigation";
import Boot from "./Boot";
import Cursor from "./Cursor";
import FieldCanvas from "./FieldCanvas";
import Hud from "./Hud";
import Fx from "./Fx";

// All ambient chrome lives here so the admin stays plain and fast.
export default function Stage() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return <><Boot /><Cursor /><FieldCanvas /><Hud /><Fx /></>;
}
