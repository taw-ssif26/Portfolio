import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// HTTP driver: no connection pool to manage on serverless.
// Limitation: no interactive transactions. Use db.batch() when you need atomic multi-writes.
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export { schema };
