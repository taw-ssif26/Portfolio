import { neon } from '@neondatabase/serverless'
import fs from 'fs/promises'
import { DEFAULT, Content } from './content'
const url = process.env.DATABASE_URL
const FILE = 'data/content.json'
export async function getContent(): Promise<Content> {
  try {
    if (url) {
      const sql = neon(url)
      await sql`create table if not exists kv (k text primary key, v jsonb not null)`
      const r = await sql`select v from kv where k = 'content'`
      if (r[0]) return { ...DEFAULT, ...(r[0].v as object) }
    } else return { ...DEFAULT, ...JSON.parse(await fs.readFile(FILE, 'utf8')) }
  } catch {}
  return DEFAULT
}
export async function saveContent(c: Content) {
  if (url) {
    const sql = neon(url)
    await sql`create table if not exists kv (k text primary key, v jsonb not null)`
    await sql`insert into kv (k, v) values ('content', ${JSON.stringify(c)}::jsonb) on conflict (k) do update set v = excluded.v`
  } else {
    await fs.mkdir('data', { recursive: true })
    await fs.writeFile(FILE, JSON.stringify(c, null, 1))
  }
}
