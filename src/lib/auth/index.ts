import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { nextCookies } from "better-auth/next-js";

/**
 * ✅ Better Auth configuration for Pages & Peace
 * Works locally and on Vercel with Supabase Postgres + Drizzle.
 */

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://pagesandpeace.co.uk"
    : "http://localhost:3000";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? BASE_URL,

  /* ---------- Database (Drizzle + Supabase) ---------- */
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  /* ---------- Auth Settings ---------- */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // No resend → disable verification
  },

  /* ---------- Cookies ---------- */
  cookies: {
    sessionToken: {
      name: "auth_session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    },
  },

  /* ---------- Advanced ---------- */
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },

  /* ---------- Plugins ---------- */
  plugins: [nextCookies()],
});
