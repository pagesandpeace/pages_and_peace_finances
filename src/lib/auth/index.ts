import { betterAuth } from "better-auth";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

/**
 * ✅ Better Auth configuration for Pages & Peace
 * - Works both locally and on Vercel
 * - Uses Supabase HTTPS client in production
 * - Falls back to Drizzle/Postgres locally
 */

// ---------- Types ----------
type UserRecord = {
  id?: string;
  name?: string | null;
  email: string;
  email_verified?: boolean | null;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
};

type SessionRecord = {
  id?: string;
  user_id: string;
  expires_at: string;
  token: string;
};

// ---------- Create Supabase HTTPS client ----------
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------- Create Drizzle DB (only used locally) ----------
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

// ---------- Better Auth Setup ----------
export const auth = betterAuth({
  /* ---------- Database Adapter ---------- */
  database:
    process.env.NODE_ENV === "development"
      ? // ✅ Local: Use Drizzle adapter
        {
          adapter: "drizzle",
          db,
          provider: "pg",
          schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
          },
        }
      : // ✅ Production (Vercel): Use Supabase HTTPS client
        {
          async findUserByEmail(email: string): Promise<UserRecord | null> {
            const { data, error } = await supabase
              .from("auth_users")
              .select("*")
              .eq("email", email)
              .maybeSingle();
            if (error) throw error;
            return data;
          },

          async insertUser(user: UserRecord): Promise<UserRecord | null> {
            const { data, error } = await supabase
              .from("auth_users")
              .insert(user)
              .select()
              .maybeSingle();
            if (error) throw error;
            return data;
          },

          async findSessionByToken(token: string): Promise<SessionRecord | null> {
            const { data, error } = await supabase
              .from("auth_sessions")
              .select("*")
              .eq("token", token)
              .maybeSingle();
            if (error) throw error;
            return data;
          },

          async insertSession(session: SessionRecord): Promise<SessionRecord | null> {
            const { data, error } = await supabase
              .from("auth_sessions")
              .insert(session)
              .select()
              .maybeSingle();
            if (error) throw error;
            return data;
          },

          async deleteSession(token: string): Promise<boolean> {
            const { error } = await supabase
              .from("auth_sessions")
              .delete()
              .eq("token", token);
            if (error) throw error;
            return true;
          },
        },

  /* ---------- Email + Password Auth ---------- */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  /* ---------- Cookies + Tokens ---------- */
  cookies: {
    secure: process.env.NODE_ENV === "production",
  },
  tokens: {
    accessTokenExpiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
  },

  /* ---------- User Mapping ---------- */
  user: {
    fields: {
      name: "name",
      email: "email",
      image: "image",
    },
  },
});
