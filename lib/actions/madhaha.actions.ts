"use server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fromFirestoreDoc,
  nowIso,
  toFirestoreData,
} from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";
import { parseStringify } from "@/lib/utils";
import { MadhahaCompetitionRegistration } from "@/types";
import { uploadFileToR2 } from "@/lib/r2/files";

const MADHAHA_DEFAULT_YEAR = "2025";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const uploaded = await uploadFileToR2(file, "madhaha/id-cards");
    return uploaded.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

const fetchMadhahaByIdAndYear = async (idCardNumber: string, year: string) =>
  getFirestoreDb()
    .collection(COLLECTIONS.madhahaCompetitionRegistrations)
    .where("idCardNumber", "==", idCardNumber)
    .where("year", "==", year)
    .limit(1)
    .get();

export const createMadhahaCompetitionRegistration = async (
  registration: MadhahaCompetitionRegistration
) => {
  try {
    const db = getFirestoreDb();
    const currentYear = String(new Date().getFullYear());
    const idForCheck = (registration.idCardNumber || "").trim();

    if (idForCheck) {
      let existing = await fetchMadhahaByIdAndYear(idForCheck, currentYear);
      if (existing.empty && idForCheck.startsWith("A")) {
        existing = await fetchMadhahaByIdAndYear(
          idForCheck.replace(/^A/, ""),
          currentYear
        );
      }
      if (!existing.empty) {
        throw new Error("ALREADY_REGISTERED_THIS_YEAR");
      }
    }

    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.madhahaCompetitionRegistrations).doc();
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

export const getQuranParticipantByIdCard = async (idCardNumber: string) => {
  try {
    const response = await getFirestoreDb()
      .collection(COLLECTIONS.quranCompetitionRegistrations)
      .where("idCardNumber", "==", idCardNumber)
      .limit(1)
      .get();

    return response.empty ? null : fromFirestoreDoc(response.docs[0]);
  } catch (error) {
    console.error("Failed to fetch Quran participant:", error);
    return null;
  }
};

export const getMadhahaParticipantByDocumentId = async (documentId: string) => {
  try {
    const doc = await getFirestoreDb()
      .collection(COLLECTIONS.madhahaCompetitionRegistrations)
      .doc(documentId)
      .get();

    return doc.exists ? parseStringify(fromFirestoreDoc(doc)) : null;
  } catch (error) {
    console.error("Failed to fetch by doc id:", error);
    return null;
  }
};

export const getMadhahaParticipantByIdCard = async (idCardNumber: string) => {
  try {
    const response = await getFirestoreDb()
      .collection(COLLECTIONS.madhahaCompetitionRegistrations)
      .where("idCardNumber", "==", idCardNumber)
      .limit(1)
      .get();

    return response.empty ? null : parseStringify(fromFirestoreDoc(response.docs[0]));
  } catch (error) {
    console.error("Failed to fetch Madhaha participant:", error);
    return null;
  }
};

const effectiveYear = (doc: { year?: string | null }) =>
  doc.year && String(doc.year).trim()
    ? String(doc.year)
    : MADHAHA_DEFAULT_YEAR;

export const getAllMadhahaCompetitionRegistrations = async (
  limit: number,
  offset: number,
  searchTerm?: string,
  year?: string
) => {
  try {
    const snapshot = await getFirestoreDb()
      .collection(COLLECTIONS.madhahaCompetitionRegistrations)
      .get();
    const query = (searchTerm || "").trim().toLowerCase();
    const all = snapshot.docs.map((doc) => fromFirestoreDoc(doc));
    const filtered = all.filter((doc: any) => {
      const matchesYear = year && year.trim() ? effectiveYear(doc) === year : true;
      const matchesSearch = query
        ? String(doc.idCardNumber || "").toLowerCase().includes(query)
        : true;
      return matchesYear && matchesSearch;
    });

    return parseStringify({
      documents: filtered.slice(offset, offset + limit),
      total: filtered.length,
    });
  } catch (err) {
    console.error("Failed to fetch Madhaha registrations:", err);
    throw new Error("Failed to fetch Madhaha registrations");
  }
};

export const updateMadhahaCompetitionRegistration = async (
  $id: string,
  data: MadhahaCompetitionRegistration
) => {
  try {
    const ref = getFirestoreDb()
      .collection(COLLECTIONS.madhahaCompetitionRegistrations)
      .doc($id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      throw new Error("No document found for the given id");
    }

    await ref.update(
      toFirestoreData({
        ...data,
        updatedAt: nowIso(),
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to update registration:", error);
    throw new Error("Failed to update registration");
  }
};
