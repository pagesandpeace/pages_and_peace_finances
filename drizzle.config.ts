import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "db.sgvkwiqxrkbpqpliauau.supabase.co",
    port: 5432,
    user: "postgres",
    password: "rHiEH*5wb!wpRpq",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false, // ✅ bypass self-signed cert rejection
    },
  },
  verbose: true,
  strict: true,
} satisfies Config;
