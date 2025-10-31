import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/**
 * ✅ Better Auth configuration for Pages & Peace Finances
 * - Uses Drizzle + Supabase Postgres
 * - No external email verification (internal users only)
 * - Secure session cookies handled automatically
 */

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // 🔐 Email + Password Auth
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // internal tool, no Resend needed
  },

  // 🧁 Session cookie config
  cookies: {
    secure: process.env.NODE_ENV === "production",
  },

  // 📦 Custom session + token settings
  tokens: {
    accessTokenExpiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
  },

  // 🧱 Custom user schema mapping
  user: {
    fields: {
      name: "name",
      email: "email",
      image: "image",
    },
  },
});
