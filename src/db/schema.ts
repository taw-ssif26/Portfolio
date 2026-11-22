import {
  pgTable, serial, text, integer, boolean, timestamp, jsonb, pgEnum, uniqueIndex,
} from "drizzle-orm/pg-core";

export const projectStatus = pgEnum("project_status", [
  "live", "beta", "in_development", "prototype", "archived",
]);
export const mediaKind = pgEnum("media_kind", ["image", "video"]);

// Drives per-project visual identity on the frontend (chatbot, flow nodes, etc.)
export const visualType = pgEnum("visual_type", [
  "default", "conversation", "flow", "sensor", "geometry", "architecture",
]);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  systemNumber: integer("system_number"),           // "SYSTEM 07"
  category: text("category").notNull().default(""), // "AI / AUTOMATION / SAAS"
  tagline: text("tagline").notNull().default(""),
  problem: text("problem").notNull().default(""),
  solution: text("solution").notNull().default(""),
  implementation: text("implementation").notNull().default(""),
  result: text("result").notNull().default(""),
  // Architecture as data so the frontend can animate flow: ordered nodes
  // [{ "id": "api", "label": "FastAPI", "note": "..." }]
  architecture: jsonb("architecture").$type<{ id: string; label: string; note?: string }[]>().notNull().default([]),
  // [{ "label": "Users", "value": "120" }]
  metrics: jsonb("metrics").$type<{ label: string; value: string }[]>().notNull().default([]),
  status: projectStatus("status").notNull().default("in_development"),
  visualType: visualType("visual_type").notNull().default("default"),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("projects_slug_idx").on(t.slug)]);

export const projectMedia = pgTable("project_media", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  kind: mediaKind("kind").notNull().default("image"),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  group: text("group").notNull().default(""), // "BACKEND", "AI", ...
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [uniqueIndex("skills_slug_idx").on(t.slug)]);

// Tech-map edges: skill <-> skill ("PYTHON" -> "AGENTS")
export const skillLinks = pgTable("skill_links", {
  id: serial("id").primaryKey(),
  fromSkillId: integer("from_skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  toSkillId: integer("to_skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
});

// Clicking a technology filters projects
export const projectSkills = pgTable("project_skills", {
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  skillId: integer("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
});

export const labEntries = pgTable("lab_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  kind: text("kind").notNull().default("note"), // note | simulation | prototype | research
  mediaUrl: text("media_url"),
  published: boolean("published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("work"), // work | education
  title: text("title").notNull(),
  organization: text("organization").notNull().default(""),
  startDate: text("start_date"),
  endDate: text("end_date"),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Key/value store for name, bio, hero text, nav labels, SEO, theme defaults.
// Avoids a migration every time you add an editable string.
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  emailed: boolean("emailed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
