"use server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fromFirestoreDoc,
  getPagedDocuments,
  nowIso,
  toFirestoreData,
} from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";
import { parseStringify } from "@/lib/utils";
import { CouncilAwardRegistration } from "@/types";

export const createCouncilAwardRegistration = async (
  registration: CouncilAwardRegistration
) => {
  try {
    const db = getFirestoreDb();
    const currentYear = String(new Date().getFullYear());
    const idForCheck = (registration.idCardNumber || "").trim();

    if (idForCheck) {
      const existing = await db
        .collection(COLLECTIONS.councilAwardRegistrations)
        .where("idCardNumber", "==", idForCheck)
        .where("year", "==", currentYear)
        .limit(1)
        .get();
      if (!existing.empty) {
        throw new Error("ALREADY_REGISTERED_THIS_YEAR");
      }
    }

    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.councilAwardRegistrations).doc();
    await ref.set(
      toFirestoreData({
        fullName: registration.fullName,
        idCardNumber: registration.idCardNumber,
        category: registration.category,
        startDate: registration.startDate || null,
        endDate: registration.endDate || null,
        examDate: registration.examDate || null,
        description: registration.description,
        year: currentYear,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to register council award:", error);
    if (
      error instanceof Error &&
      error.message === "ALREADY_REGISTERED_THIS_YEAR"
    ) {
      throw error;
    }
    throw new Error("Failed to register");
  }
};

export const getAllCouncilAwardRegistrations = async (
  limit: number,
  offset: number,
  year?: string
) => {
  try {
    const collection = getFirestoreDb().collection(
      COLLECTIONS.councilAwardRegistrations
    );
    const baseQuery =
      year && year.trim()
        ? collection.where("year", "==", year)
        : collection;
    const result = await getPagedDocuments({
      baseQuery,
      pagedQuery: baseQuery.limit(limit).offset(offset),
    });

    return parseStringify(result);
  } catch (error) {
    console.error("Failed to fetch council award registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const deleteCouncilAwardRegistration = async (documentId: string) => {
  try {
    await getFirestoreDb()
      .collection(COLLECTIONS.councilAwardRegistrations)
      .doc(documentId)
      .delete();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete council award registration:", error);
    throw new Error("Failed to delete registration");
  }
};
