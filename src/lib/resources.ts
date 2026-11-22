import { getTableColumns } from "drizzle-orm";
import { schema } from "@/db";

// URL segment -> table + cache tag to invalidate on write
export const resources: Record<string, { table: any; tag: string }> = {
  projects: { table: schema.projects, tag: "projects" },
  "project-media": { table: schema.projectMedia, tag: "projects" },
  skills: { table: schema.skills, tag: "skills" },
  "skill-links": { table: schema.skillLinks, tag: "skills" },
  lab: { table: schema.labEntries, tag: "lab" },
  experience: { table: schema.experience, tag: "experience" },
  social: { table: schema.socialLinks, tag: "social" },
};

// Whitelist: only real columns, never id/timestamps from the client.
export function clean(table: any, body: Record<string, unknown>) {
  const cols = getTableColumns(table);
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(body)) {
    if (k in cols && !["id", "createdAt", "updatedAt"].includes(k)) out[k] = body[k];
  }
  return out;
}
