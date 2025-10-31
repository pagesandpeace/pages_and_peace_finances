import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

/**
 * ✅ Better Auth configuration for Pages & Peace
 * - Local: uses Drizzle/Postgres adapter
 * - Vercel: uses Supabase HTTPS adapter
 * - Prevents ENOTFOUND + adapter init errors
 */

// ---------- Supabase HTTPS client ----------
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------- Local Drizzle DB ----------
let db: any = null;

if (process.env.NODE_ENV === "development") {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error("❌ DATABASE_URL not defined in development.");

  const cleanUrl = connectionString
    .replace("?pgbouncer=true&sslmode=require", "")
    .replace("&pgbouncer=true", "")
    .replace("?sslmode=require", "");

  const pool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false },
  });

  db = drizzle(pool, { schema });
}

// ---------- Build adapter ----------
const databaseAdapter =
  process.env.NODE_ENV === "development"
    ? drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      })
    : {
        // ⚡ Minimal HTTPS adapter implementing required methods
        async findUserByEmail(email: string) {
          const { data, error } = await supabase
            .from("auth_users")
            .select("*")
            .eq("email", email)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        async insertUser(user: any) {
          const { data, error } = await supabase
            .from("auth_users")
            .insert(user)
            .select()
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        async findSessionByToken(token: string) {
          const { data, error } = await supabase
            .from("auth_sessions")
            .select("*")
            .eq("token", token)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        async insertSession(session: any) {
          const { data, error } = await supabase
            .from("auth_sessions")
            .insert(session)
            .select()
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        async deleteSession(token: string) {
          const { error } = await supabase
            .from("auth_sessions")
            .delete()
            .eq("token", token);
          if (error) throw error;
          return true;
        },
        // Add placeholders so Better Auth doesn’t fail init
        async findUserById() {
          return null;
        },
        async updateUser() {
          return null;
        },
        async findAccountByProvider() {
          return null;
        },
        async insertAccount() {
          return null;
        },
        async findVerification() {
          return null;
        },
        async insertVerification() {
          return null;
        },
        async deleteVerification() {
          return null;
        },
      };

// ---------- Initialize Better Auth ----------
export const auth = betterAuth({
  database: databaseAdapter,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  cookies: {
    secure: process.env.NODE_ENV === "production",
  },

  tokens: {
    accessTokenExpiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
  },

  user: {
    fields: {
      name: "name",
      email: "email",
      image: "image",
    },
  },
});
