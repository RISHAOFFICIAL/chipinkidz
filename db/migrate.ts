/**
 * ChipIn Kids — Database Migration Runner
 *
 * Applies SQL migration files from the `db/` directory in order.
 * Run: `DATABASE_URL=... bun run db:migrate`
 *
 * Migrations are tracked in a `_migrations` table so they only run once.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname);
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Set it before running migrations.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log("🚀 ChipIn Kids — Database Migration");

  // Ensure migrations tracking table exists
  await sql(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const migrations = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  // Get already-applied migrations
  const applied = await sql`SELECT name FROM _migrations ORDER BY name`;
  const appliedNames = new Set(applied.map((r: { name: string }) => r.name));

  for (const migration of migrations) {
    if (appliedNames.has(migration)) {
      console.log(`  ⏭  ${migration} — already applied, skipping`);
      continue;
    }

    const fullPath = join(MIGRATIONS_DIR, migration);
    const content = readFileSync(fullPath, "utf8");

    console.log(`  ▶  ${migration} — applying...`);

    try {
      // Run each statement separately to handle multiple statements
      const statements = content
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const stmt of statements) {
        await sql(stmt + ";");
      }

      // Record this migration
      await sql`INSERT INTO _migrations (name) VALUES (${migration})`;

      console.log(`  ✅ ${migration} — applied successfully`);
    } catch (err) {
      console.error(`  ❌ ${migration} — failed:`, err);
      process.exit(1);
    }
  }

  console.log("✅ All migrations applied.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});