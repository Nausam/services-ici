import path from "node:path";
import { createClerkClient } from "@clerk/backend";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getArtifactDir, readJson, requireEnv, writeJson } from "./shared";

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

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts.shift() || fullName,
    lastName: parts.join(" ") || undefined,
  };
};

const main = async () => {
  initFirebase();
  const artifactDir = getArtifactDir();
  const clerk = createClerkClient({ secretKey: requireEnv("CLERK_SECRET_KEY") });
  const db = getFirestore();
  const usersExport = await readJson<{ documents: Record<string, any>[] }>(
    path.join(artifactDir, "data", "users.json")
  );
  const results: unknown[] = [];

  for (const sourceUser of usersExport.documents) {
    const email = String(sourceUser.email || "").trim().toLowerCase();
    if (!email) continue;

    const fullName = String(sourceUser.fullName || email);
    const existing = await clerk.users.getUserList({ emailAddress: [email] });
    const clerkUser =
      existing.data[0] ||
      (await clerk.users.createUser({
        emailAddress: [email],
        ...splitName(fullName),
        externalId: sourceUser.accountId || sourceUser.$id,
        skipPasswordRequirement: true,
        skipLegalChecks: true,
        privateMetadata: {
          legacyAppwriteAccountId: sourceUser.accountId || null,
          legacyAppwriteUserDocumentId: sourceUser.$id || null,
        },
      }));

    await clerk.invitations.createInvitation({
      emailAddress: email,
      notify: true,
      ignoreExisting: true,
      publicMetadata: {
        migratedFrom: "appwrite",
      },
    });

    const timestamp = new Date().toISOString();
    await db.collection("users").doc(clerkUser.id).set(
      {
        clerkUserId: clerkUser.id,
        email,
        fullName,
        isAdmin: Boolean(sourceUser.isAdmin),
        isSuperAdmin: Boolean(sourceUser.isSuperAdmin),
        legacyAppwriteAccountId: sourceUser.accountId || null,
        legacyAppwriteUserDocumentId: sourceUser.$id || null,
        appwriteId: sourceUser.$id || null,
        createdAt: sourceUser.$createdAt || timestamp,
        updatedAt: timestamp,
      },
      { merge: true }
    );

    results.push({
      email,
      clerkUserId: clerkUser.id,
      legacyAppwriteUserDocumentId: sourceUser.$id,
    });
  }

  await writeJson(path.join(artifactDir, "clerk-user-map.json"), results);
  console.log(`Migrated ${results.length} Clerk users/profiles.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
