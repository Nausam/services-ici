/**
 * Run once to create the "Council Award" collection in Appwrite.
 *
 * Usage:
 *   node scripts/create-council-award-collection.mjs
 *
 * Requires these env vars (from your .env.local):
 *   NEXT_PUBLIC_APPWRITE_ENDPOINT
 *   NEXT_PUBLIC_APPWRITE_PROJECT_ID
 *   NEXT_APPWRITE_KEY
 *   NEXT_PUBLIC_APPWRITE_DATABASE
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Databases, Permission, Role } from "node-appwrite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvLocal();

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.NEXT_APPWRITE_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;

const COLLECTION_ID = "council-award";
const COLLECTION_NAME = "Council Award Registrations";

async function main() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const db = new Databases(client);

  // 1. Create collection
  console.log("Creating collection...");
  await db.createCollection(
    DATABASE_ID,
    COLLECTION_ID,
    COLLECTION_NAME,
    [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ]
  );
  console.log(`Collection "${COLLECTION_NAME}" created with ID: ${COLLECTION_ID}`);

  // 2. Create attributes
  const attrs = [
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "fullName", 255, true),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "idCardNumber", 20, true),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "category", 500, true),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "startDate", 20, false),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "endDate", 20, false),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "examDate", 20, false),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "description", 5000, true),
    () =>
      db.createStringAttribute(DATABASE_ID, COLLECTION_ID, "year", 10, false),
  ];

  for (const create of attrs) {
    const attr = await create();
    console.log(`  ✓ Attribute "${attr.key}" created`);
    // Small delay so Appwrite processes each attribute
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log("\nDone! Add this to your .env.local:");
  console.log(`NEXT_PUBLIC_APPWRITE_COUNCIL_AWARD_COLLECTION=${COLLECTION_ID}`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
