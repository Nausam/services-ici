import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getArtifactDir, readJson, requireEnv } from "./shared";

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

const main = async () => {
  initFirebase();
  const db = getFirestore();
  const artifactDir = getArtifactDir();
  const mappings = await readJson<any[]>(
    path.join(artifactDir, "file-url-map.json")
  );

  let batch = db.batch();
  let pending = 0;

  for (const mapping of mappings) {
    const update: Record<string, unknown> = {
      [mapping.field]: mapping.missing ? null : mapping.r2Url,
      legacyAppwriteFileUrl: mapping.legacyUrl,
      legacyAppwriteFileId: mapping.legacyFileId,
      updatedAt: new Date().toISOString(),
    };
    if (mapping.idField) update[mapping.idField] = mapping.missing ? null : mapping.r2Key;

    batch.update(db.collection(mapping.collection).doc(mapping.docId), update as any);
    pending += 1;

    if (pending >= 450) {
      await batch.commit();
      batch = db.batch();
      pending = 0;
    }
  }

  if (pending > 0) await batch.commit();
  console.log(`Rewrote ${mappings.length} file references.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
