import "server-only";

import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { fromFirestoreDoc, nowIso, toFirestoreData } from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";

export const getCurrentUserProfile = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const db = getFirestoreDb();
  const ref = db.collection(COLLECTIONS.users).doc(userId);
  const snapshot = await ref.get();

  if (snapshot.exists) {
    return fromFirestoreDoc(snapshot);
  }

  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const fullName =
    clerkUser.fullName ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    primaryEmail;

  const timestamp = nowIso();
  const profile = toFirestoreData({
    clerkUserId: userId,
    email: primaryEmail,
    fullName,
    isAdmin: false,
    isSuperAdmin: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await ref.set(profile);
  const created = await ref.get();

  return fromFirestoreDoc(created);
};
