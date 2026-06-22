import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  COLLECTION_EXPORTS,
  FILE_FIELDS,
  getArtifactDir,
  readJson,
  requireEnv,
} from "./shared";

const initFirebase = () => {
  if (getApps()[0]) return;
  initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
};

const verifyUrl = async (url: string) => {
  const response = await fetch(url, { method: "HEAD" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
};

const main = async () => {
  initFirebase();
  const db = getFirestore();
  const artifactDir = getArtifactDir();

  for (const collection of COLLECTION_EXPORTS) {
    let source: { total: number; documents: Record<string, unknown>[] };
    try {
      source = await readJson(path.join(artifactDir, "data", collection.file));
    } catch {
      if ("optional" in collection && collection.optional) continue;
      throw new Error(`Missing export for ${collection.target}`);
    }

    const target = await db.collection(collection.target).get();
    const targetIds = new Set(target.docs.map((doc) => doc.id));
    const missingIds = source.documents
      .map((doc) => String(doc.$id))
      .filter((id) => !targetIds.has(id));

    if (missingIds.length > 0) {
      throw new Error(
        `Missing ${missingIds.length} source docs in ${collection.target}: ${missingIds
          .slice(0, 10)
          .join(", ")}`
      );
    }

    if (collection.target !== "users" && source.total !== target.size) {
      throw new Error(
        `Count mismatch for ${collection.target}: source=${source.total}, target=${target.size}`
      );
    }

    const extra = target.size - source.total;
    console.log(
      `Docs OK: ${collection.target} source=${source.total}, target=${target.size}${
        extra > 0 ? `, extra=${extra}` : ""
      }`
    );
  }

  for (const field of FILE_FIELDS) {
    const snapshot = await db.collection(field.collection).get();
    for (const doc of snapshot.docs) {
      const url = doc.data()[field.field];
      if (typeof url === "string" && url.startsWith("http")) {
        await verifyUrl(url);
      }
    }
    console.log(`File URLs OK: ${field.collection}.${field.field}`);
  }

  const adminUsers = await db
    .collection("users")
    .where("isAdmin", "==", true)
    .get();
  console.log(`Admin profiles found: ${adminUsers.size}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
