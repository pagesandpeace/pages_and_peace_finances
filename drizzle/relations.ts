import { relations } from "drizzle-orm/relations";
import { journalEntries, journalLines, users, accounts, sessions } from "./schema";

export const journalLinesRelations = relations(journalLines, ({one}) => ({
	journalEntry: one(journalEntries, {
		fields: [journalLines.journalId],
		references: [journalEntries.id]
	}),
}));

export const journalEntriesRelations = relations(journalEntries, ({many}) => ({
	journalLines: many(journalLines),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));