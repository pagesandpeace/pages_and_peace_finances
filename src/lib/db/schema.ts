import { pgTable, text, timestamp, boolean, uuid, numeric } from "drizzle-orm/pg-core";

/* ---------- AUTH USERS ---------- */
export const users = pgTable("auth_users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/* ---------- AUTH SESSIONS ---------- */
export const sessions = pgTable("auth_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  // 🔹 Metadata Better Auth may log
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  device: text("device"),

  // 🔹 Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});




/* ---------- AUTH ACCOUNTS ---------- */
export const accounts = pgTable("auth_accounts", {
  id: text("id").primaryKey(), // ✅ matches DB
  accountId: text("account_id").unique(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});




/* ---------- AUTH VERIFICATIONS ---------- */
export const verifications = pgTable("auth_verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ---------- JOURNAL ENTRIES ---------- */
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------- JOURNAL LINES ---------- */
export const journalLines = pgTable("journal_lines", {
  id: uuid("id").defaultRandom().primaryKey(),
  journalId: uuid("journal_id")
    .notNull()
    .references(() => journalEntries.id),
  accountId: uuid("account_id").notNull(),
  debit: numeric("debit").default("0"),
  credit: numeric("credit").default("0"),
});

/* ---------- LEDGER ACCOUNTS ---------- */
export const ledgerAccounts = pgTable("ledger_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Asset / Liability / Equity / Income / Expense
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
