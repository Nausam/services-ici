"use server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fromFirestoreDoc,
  nowIso,
  toFirestoreData,
} from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";
import { parseStringify } from "@/lib/utils";
import {
  QuranCompetitionRegistration,
  QuranCompetitionType,
} from "@/types";
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

const DEFAULT_QURAN_COMPETITION_TYPE: QuranCompetitionType = "council-quran";

const effectiveCompetitionType = (
  doc: { competitionType?: string | null } | undefined
) =>
  doc?.competitionType && String(doc.competitionType).trim()
    ? String(doc.competitionType)
    : DEFAULT_QURAN_COMPETITION_TYPE;

const fetchQuranByIdYearAndType = async (
  idCardNumber: string,
  year: string,
  competitionType: QuranCompetitionType
) => {
  const snapshot = await getFirestoreDb()
    .collection(COLLECTIONS.quranCompetitionRegistrations)
    .where("idCardNumber", "==", idCardNumber)
    .where("year", "==", year)
    .get();

  return snapshot.docs.find(
    (doc) => effectiveCompetitionType(doc.data()) === competitionType
  );
};

export const createQuranCompetitionRegistration = async (
  registration: QuranCompetitionRegistration
) => {
  try {
    const db = getFirestoreDb();
    const currentYear = String(new Date().getFullYear());
    const idForCheck = (registration.idCardNumber || "").trim();
    const competitionType =
      registration.competitionType || DEFAULT_QURAN_COMPETITION_TYPE;

    if (idForCheck) {
      let existing = await fetchQuranByIdYearAndType(
        idForCheck,
        currentYear,
        competitionType
      );
      if (!existing && idForCheck.startsWith("A")) {
        existing = await fetchQuranByIdYearAndType(
          idForCheck.replace(/^A/, ""),
          currentYear,
          competitionType
        );
      }
      if (existing) {
        throw new Error("ALREADY_REGISTERED_THIS_YEAR");
      }
    }

    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.quranCompetitionRegistrations).doc();
    await ref.set(
      toFirestoreData({
        ...registration,
        competitionType,
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
  year?: string,
  competitionType: QuranCompetitionType = DEFAULT_QURAN_COMPETITION_TYPE
) => {
  try {
    const snapshot = await getFirestoreDb()
      .collection(COLLECTIONS.quranCompetitionRegistrations)
      .get();
    const filtered = snapshot.docs
      .map((doc) => fromFirestoreDoc(doc))
      .filter((doc: any) => {
        const matchesType = effectiveCompetitionType(doc) === competitionType;
        const matchesYear =
          year && year.trim() ? String(doc.year || "") === year : true;
        return matchesType && matchesYear;
      });

    return parseStringify({
      documents: filtered.slice(offset, offset + limit),
      total: filtered.length,
    });
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
        .get();

    let response = await fetchByCard(id);
    if (response.empty && id.startsWith("A")) {
      response = await fetchByCard(id.replace(/^A/, ""));
    }

    if (response.empty) {
      throw new Error("Participant not found");
    }

    const [latest] = response.docs.sort((a, b) => {
      const aCreated = String(a.data().createdAt || "");
      const bCreated = String(b.data().createdAt || "");
      return bCreated.localeCompare(aCreated);
    });

    return parseStringify(fromFirestoreDoc(latest));
  } catch (error) {
    console.error("Failed to fetch registration:", error);
    throw new Error("Failed to fetch participant details");
  }
};

export const deleteQuranCompetitionRegistration = async (
  documentId: string
) => {
  try {
    const id = String(documentId || "").trim();

    if (!id) {
      throw new Error("Invalid document id provided.");
    }

    const ref = getFirestoreDb()
      .collection(COLLECTIONS.quranCompetitionRegistrations)
      .doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new Error("No document found for the given document id");
    }

    await ref.delete();

    return { success: true };
  } catch (error) {
    console.error("Failed to delete Quran registration:", error);
    throw new Error("Failed to delete registration");
  }
};
