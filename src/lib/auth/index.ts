import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/**
 * ✅ Better Auth configuration for Pages & Peace Finances
 * - Uses Drizzle + Supabase Postgres
 * - Clean `auth_*` table names to avoid Supabase Auth conflicts
 * - Secure session cookies handled automatically
 */

export const auth = betterAuth({
  /* ---------- Database Configuration ---------- */
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,          // auth_users
      session: schema.sessions,    // auth_sessions
      account: schema.accounts,    // auth_accounts
      verification: schema.verifications, // auth_verifications
    },
  }),

  /* ---------- Email + Password Auth ---------- */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // internal users only
  },

  /* ---------- Cookie + Token Settings ---------- */
  cookies: {
    secure: process.env.NODE_ENV === "production",
  },
  tokens: {
    accessTokenExpiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
  },

  /* ---------- Custom User Schema Mapping ---------- */
  user: {
    fields: {
      name: "name",
      email: "email",
      image: "image",
    },
  },
});
