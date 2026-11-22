import { unstable_cache } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db, schema as s } from "@/db";

// Public reads: cached + tagged. Admin writes call revalidateTag() with the same tag.
export const getSettings = unstable_cache(
  async () => {
    const rows = await db.select().from(s.siteSettings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, any>;
  },
  ["settings"],
  { tags: ["settings"] },
);

export const getProjects = unstable_cache(
  async () =>
    db.select().from(s.projects).where(eq(s.projects.published, true)).orderBy(asc(s.projects.sortOrder)),
  ["projects"],
  { tags: ["projects"] },
);

export const getProject = (slug: string) =>
  unstable_cache(
    async () => {
      const [p] = await db
        .select().from(s.projects)
        .where(and(eq(s.projects.slug, slug), eq(s.projects.published, true))).limit(1);
      if (!p) return null;
      const media = await db.select().from(s.projectMedia)
        .where(eq(s.projectMedia.projectId, p.id)).orderBy(asc(s.projectMedia.sortOrder));
      return { ...p, media };
    },
    ["project", slug],
    { tags: ["projects"] },
  )();

export const getLab = unstable_cache(
  async () => db.select().from(s.labEntries).where(eq(s.labEntries.published, true)).orderBy(asc(s.labEntries.sortOrder)),
  ["lab"], { tags: ["lab"] },
);
export const getSkills = unstable_cache(
  async () => db.select().from(s.skills).orderBy(asc(s.skills.sortOrder)),
  ["skills"], { tags: ["skills"] },
);
export const getSocial = unstable_cache(
  async () => db.select().from(s.socialLinks).orderBy(asc(s.socialLinks.sortOrder)),
  ["social"], { tags: ["social"] },
);

// settings value with fallback
export const setting = <T,>(all: Record<string, any>, key: string, fallback: T): T =>
  all[key] ?? fallback;
