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
import { QuranCompetitionRegistration } from "@/types";
import { uploadFileToR2 } from "@/lib/r2/files";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const uploaded = await uploadFileToR2(file, "quran-competition/id-cards");
    return uploaded.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

const fetchQuranByIdAndYear = async (idCardNumber: string, year: string) =>
  getFirestoreDb()
    .collection(COLLECTIONS.quranCompetitionRegistrations)
    .where("idCardNumber", "==", idCardNumber)
    .where("year", "==", year)
    .limit(1)
    .get();

export const createQuranCompetitionRegistration = async (
  registration: QuranCompetitionRegistration
) => {
  try {
    const db = getFirestoreDb();
    const currentYear = String(new Date().getFullYear());
    const idForCheck = (registration.idCardNumber || "").trim();

    if (idForCheck) {
      let existing = await fetchQuranByIdAndYear(idForCheck, currentYear);
      if (existing.empty && idForCheck.startsWith("A")) {
        existing = await fetchQuranByIdAndYear(
          idForCheck.replace(/^A/, ""),
          currentYear
        );
      }
      if (!existing.empty) {
        throw new Error("ALREADY_REGISTERED_THIS_YEAR");
      }
    }

    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.quranCompetitionRegistrations).doc();
    await ref.set(
      toFirestoreData({
        ...registration,
        year: currentYear,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to register:", error);
    if (
      error instanceof Error &&
      error.message === "ALREADY_REGISTERED_THIS_YEAR"
    ) {
      throw error;
    }
    throw new Error("Failed to register");
  }
};

export const getAllQuranCompetitionRegistrations = async (
  limit: number,
  offset: number,
  year?: string
) => {
  try {
    const collection = getFirestoreDb().collection(
      COLLECTIONS.quranCompetitionRegistrations
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
    console.error("Failed to fetch registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const getQuranRegistrationById = async (
  idCardNumber: string | string[] | undefined
) => {
  try {
    if (!idCardNumber || Array.isArray(idCardNumber)) {
      throw new Error("Invalid ID card number provided.");
    }

    const id = String(idCardNumber).trim();
    const fetchByCard = (card: string) =>
      getFirestoreDb()
        .collection(COLLECTIONS.quranCompetitionRegistrations)
        .where("idCardNumber", "==", card)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

    let response = await fetchByCard(id);
    if (response.empty && id.startsWith("A")) {
      response = await fetchByCard(id.replace(/^A/, ""));
    }

    if (response.empty) {
      throw new Error("Participant not found");
    }

    return parseStringify(fromFirestoreDoc(response.docs[0]));
  } catch (error) {
    console.error("Failed to fetch registration:", error);
    throw new Error("Failed to fetch participant details");
  }
};
