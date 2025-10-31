import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("❌ DATABASE_URL not defined.");

const globalForDb = global as unknown as {
  pgPool?: Pool;
  db?: ReturnType<typeof drizzle>;
};

if (!globalForDb.pgPool) {
  const cleanUrl = connectionString
    .replace("?pgbouncer=true&sslmode=require", "")
    .replace("&pgbouncer=true", "")
    .replace("?sslmode=require", "");

  globalForDb.pgPool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
  });
}

// ✅ Correct drizzle call
if (!globalForDb.db) {
  globalForDb.db = drizzle(globalForDb.pgPool, {
    schema,
    logger: true,
  });
}

export const db = globalForDb.db!;
