import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * ✅ Pages & Peace Database Connection
 * - Uses Postgres directly only in local/dev
 * - Skips pool creation on Vercel (serverless) to prevent ENOTFOUND errors
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL not defined. Check your environment variables.");
}

// Attach to global object to avoid multiple pools in dev
const globalForDb = global as unknown as {
  pgPool?: Pool;
  db?: ReturnType<typeof drizzle>;
};

// Only create a live Postgres connection in development
if (process.env.NODE_ENV === "development") {
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

  if (!globalForDb.db) {
    globalForDb.db = drizzle(globalForDb.pgPool, {
      schema,
      logger: true,
    });
  }
}

// ✅ Export a safe db object (null in production)
export const db = globalForDb.db ?? ({} as ReturnType<typeof drizzle>);
