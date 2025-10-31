ALTER TABLE "auth_accounts" ADD COLUMN "account_id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_accounts" DROP COLUMN "id";