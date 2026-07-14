/**
 * ChipIn Kids — Database Seed Script
 *
 * Seeds the database with initial reference data.
 * Run: `DATABASE_URL=... bun run db:seed`
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log("🌱 ChipIn Kids — Database Seed");

  // Add campaign status enum values as reference data
  // (maintained in application code, this seeds optional reference data)

  console.log("✅ Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});