import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "dev.db");
const migrationPath = path.join(__dirname, "migrations", "20260906000000_init", "migration.sql");

await mkdir(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'").get();

if (!tableExists) {
  const sql = readFileSync(migrationPath, "utf8");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(sql);
  db.exec(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "checksum" TEXT NOT NULL,
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT current_timestamp,
      "applied_steps_count" INTEGER UNSIGNED NOT NULL DEFAULT 0
    );
  `);
  db.prepare(
    'INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count") VALUES (?, ?, current_timestamp, ?, ?)'
  ).run("20260906000000_init", "manual-sqlite-init", "20260906000000_init", 1);
  console.log(`Created SQLite database at ${dbPath}`);
} else {
  console.log(`SQLite database already exists at ${dbPath}`);
}

db.close();
