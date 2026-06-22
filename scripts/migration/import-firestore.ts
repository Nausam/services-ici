import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  COLLECTION_EXPORTS,
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

const stripAppwriteFields = (doc: Record<string, unknown>) => {
  const {
    $id,
    $databaseId,
    $collectionId,
    $permissions,
    $createdAt,
    $updatedAt,
    ...rest
  } = doc;

  return {
    ...rest,
    appwriteId: $id,
    createdAt: rest.createdAt || $createdAt || new Date().toISOString(),
    updatedAt: rest.updatedAt || $updatedAt || new Date().toISOString(),
  };
};

const normalizeLegacyData = (
  collection: string,
  doc: Record<string, unknown>
) => {
  if (
    (collection === "madhahaCompetitionRegistrations" ||
      collection === "huthubaBangiCompetitionRegistrations") &&
    !doc.year
  ) {
    doc.year = "2025";
  }
  return doc;
};

const main = async () => {
  initFirebase();
  const db = getFirestore();
  const artifactDir = getArtifactDir();

  for (const collection of COLLECTION_EXPORTS) {
    const filePath = path.join(artifactDir, "data", collection.file);
    let payload: { documents: Record<string, unknown>[] };

    try {
      payload = await readJson(filePath);
    } catch {
      if ("optional" in collection && collection.optional) continue;
      throw new Error(`Missing export file: ${filePath}`);
    }

    let batch = db.batch();
    let pending = 0;

    for (const sourceDoc of payload.documents) {
      const id = String(sourceDoc.$id);
      const data = normalizeLegacyData(
        collection.target,
        stripAppwriteFields(sourceDoc)
      );
      batch.set(db.collection(collection.target).doc(id), data);
      pending += 1;

      if (pending >= 450) {
        await batch.commit();
        batch = db.batch();
        pending = 0;
      }
    }

    if (pending > 0) await batch.commit();
    console.log(`Imported ${payload.documents.length}: ${collection.target}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
