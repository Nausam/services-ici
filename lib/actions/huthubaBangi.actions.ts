"use server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fromFirestoreDoc,
  nowIso,
  toFirestoreData,
} from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";
import { parseStringify } from "@/lib/utils";
import { HuthubaBangiCompetitionRegistration } from "@/types";
import { uploadFileToR2 } from "@/lib/r2/files";

const HUTHUBA_BANGI_DEFAULT_YEAR = "2025";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const uploaded = await uploadFileToR2(file, "huthuba-bangi/id-cards");
    return uploaded.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

const fetchByIdAndYear = async (idCardNumber: string, year: string) =>
  getFirestoreDb()
    .collection(COLLECTIONS.huthubaBangiCompetitionRegistrations)
    .where("idCardNumber", "==", idCardNumber)
    .where("year", "==", year)
    .limit(1)
    .get();

export const createHuthubaBangiCompetitionRegistration = async (
  registration: HuthubaBangiCompetitionRegistration
) => {
  try {
    const db = getFirestoreDb();
    const currentYear = String(new Date().getFullYear());
    const idForCheck = (registration.idCardNumber || "").trim();

    if (idForCheck) {
      let existing = await fetchByIdAndYear(idForCheck, currentYear);
      if (existing.empty && idForCheck.startsWith("A")) {
        existing = await fetchByIdAndYear(
          idForCheck.replace(/^A/, ""),
          currentYear
        );
      }
      if (!existing.empty) {
        throw new Error("ALREADY_REGISTERED_THIS_YEAR");
      }
    }

    const timestamp = nowIso();
    const ref = db
      .collection(COLLECTIONS.huthubaBangiCompetitionRegistrations)
      .doc();
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

export const getHuthubaBangiParticipantByIdCard = async (
  idCardNumber: string
) => {
  try {
    const response = await getFirestoreDb()
      .collection(COLLECTIONS.huthubaBangiCompetitionRegistrations)
      .where("idCardNumber", "==", idCardNumber)
      .limit(1)
      .get();

    return response.empty ? null : parseStringify(fromFirestoreDoc(response.docs[0]));
  } catch (error) {
    console.error("Failed to fetch Huthuba-Bangi participant:", error);
    return null;
  }
};

const effectiveYear = (doc: { year?: string | null }) =>
  doc.year && String(doc.year).trim()
    ? String(doc.year)
    : HUTHUBA_BANGI_DEFAULT_YEAR;

export const getAllHuthubaBangiCompetitionRegistrations = async (
  limit: number,
  offset: number,
  year?: string
) => {
  try {
    const snapshot = await getFirestoreDb()
      .collection(COLLECTIONS.huthubaBangiCompetitionRegistrations)
      .get();
    const all = snapshot.docs.map((doc) => fromFirestoreDoc(doc));
    const filtered =
      year && year.trim()
        ? all.filter((doc: any) => effectiveYear(doc) === year)
        : all;

    return parseStringify({
      documents: filtered.slice(offset, offset + limit),
      total: filtered.length,
    });
  } catch (err) {
    console.error("Failed to fetch registrations:", err);
    throw new Error("Failed to fetch registrations");
  }
};

const findHuthubaDocByIdCard = async (idCardNumber: string) =>
  getFirestoreDb()
    .collection(COLLECTIONS.huthubaBangiCompetitionRegistrations)
    .where("idCardNumber", "==", idCardNumber)
    .limit(1)
    .get();

export const updateHuthubaBangiCompetitionRegistration = async (
  idCardNumber: string,
  data: HuthubaBangiCompetitionRegistration
) => {
  try {
    const existingDocs = await findHuthubaDocByIdCard(idCardNumber);

    if (existingDocs.empty) {
      throw new Error("No document found for the given idCardNumber");
    }

    const ref = existingDocs.docs[0].ref;
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

export const deleteHuthubaBangiCompetitionRegistration = async (
  idCardNumber: string
) => {
  try {
    const existingDocs = await findHuthubaDocByIdCard(idCardNumber);

    if (existingDocs.empty) {
      throw new Error("No document found for the given idCardNumber");
    }

    await existingDocs.docs[0].ref.delete();

    return { success: true };
  } catch (error) {
    console.error("Failed to delete registration:", error);
    throw new Error("Failed to delete registration");
  }
};
