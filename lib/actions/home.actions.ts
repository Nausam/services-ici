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
import { homeCardRegistrationSchema } from "@/lib/validations";
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/r2/files";
import type {
  HomeCardRegistration,
  HomeCardRegistrationAge,
} from "@/types";

type CreateHomeCompetitionsCardParams = {
  title: string;
  description: string;
  link?: string;
  buttonText: string;
  dueDate: string;
  image: string;
  hidden: boolean;
  imageId: string;
  category: string;
};

export const uploadImage = async (
  file: File
): Promise<{ url: string; id: string }> => {
  try {
    const uploaded = await uploadFileToR2(file, "home-cards");
    return {
      url: uploaded.url,
      id: uploaded.key,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

export const createHomeCards = async (
  data: CreateHomeCompetitionsCardParams
) => {
  try {
    const db = getFirestoreDb();
    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.homeCards).doc();
    const link = data.link?.trim() || `/home-cards/${ref.id}`;

    await ref.set(
      toFirestoreData({
        ...data,
        link,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

export const getAllCardsByCategory = async (
  category: string,
  limit: number,
  offset: number
) => {
  try {
    const baseQuery = getFirestoreDb()
      .collection(COLLECTIONS.homeCards)
      .where("category", "==", category);
    const result = await getPagedDocuments({
      baseQuery,
      pagedQuery: baseQuery.limit(limit).offset(offset),
    });

    return parseStringify(result);
  } catch (error) {
    console.error("Failed to fetch cards by category:", error);
    throw new Error("Failed to fetch cards by category");
  }
};

export const updateHomeCards = async (
  id: string,
  data: CreateHomeCompetitionsCardParams
) => {
  try {
    const ref = getFirestoreDb().collection(COLLECTIONS.homeCards).doc(id);
    const link = data.link?.trim() || `/home-cards/${id}`;

    await ref.update(
      toFirestoreData({
        ...data,
        link,
        updatedAt: nowIso(),
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to update card:", error);
    throw new Error("Failed to update card");
  }
};

export const getHomeCompetitionsCardById = async (id: string) => {
  try {
    const snapshot = await getFirestoreDb()
      .collection(COLLECTIONS.homeCards)
      .doc(id)
      .get();

    if (!snapshot.exists) throw new Error("Home Card not found");
    return parseStringify(fromFirestoreDoc(snapshot));
  } catch (error) {
    console.error("Failed to fetch Home Card:", error);
    throw new Error("Failed to fetch Home Card");
  }
};

const HOME_CARD_REGISTRATION_MAX_FILE_SIZE = 10 * 1024 * 1024;
const HOME_CARD_REGISTRATION_ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);

const uploadHomeCardRegistrationFile = async (
  file: File,
  folder:
    | "home-card-registrations/id-cards"
    | "home-card-registrations/parent-approvals"
) => {
  if (!file || file.size > HOME_CARD_REGISTRATION_MAX_FILE_SIZE) {
    throw new Error("HOME_CARD_REGISTRATION_FILE_TOO_LARGE");
  }

  if (!HOME_CARD_REGISTRATION_ALLOWED_FILE_TYPES.has(file.type)) {
    throw new Error("HOME_CARD_REGISTRATION_FILE_TYPE_NOT_SUPPORTED");
  }

  const uploaded = await uploadFileToR2(file, folder);
  return uploaded.url;
};

export const uploadHomeCardRegistrationIdCard = async (
  file: File
): Promise<string> => {
  try {
    return await uploadHomeCardRegistrationFile(
      file,
      "home-card-registrations/id-cards"
    );
  } catch (error) {
    console.error("Home-card ID card upload failed:", error);
    throw new Error("Failed to upload ID card");
  }
};

export const uploadHomeCardParentApproval = async (
  file: File
): Promise<string> => {
  try {
    return await uploadHomeCardRegistrationFile(
      file,
      "home-card-registrations/parent-approvals"
    );
  } catch (error) {
    console.error("Home-card parent approval upload failed:", error);
    throw new Error("Failed to upload parent approval");
  }
};

type CreateHomeCardRegistrationParams = {
  homeCardId: string;
  fullName: string;
  age: HomeCardRegistrationAge;
  idCardNumber: string;
  contactNumber: string;
  idCard: string;
  parentApprovalLetter?: string;
};

export const createHomeCardRegistration = async (
  data: CreateHomeCardRegistrationParams
) => {
  try {
    const homeCardId = data.homeCardId.trim();
    if (!homeCardId) throw new Error("HOME_CARD_NOT_FOUND");

    const parsed = homeCardRegistrationSchema.safeParse({
      fullName: data.fullName,
      age: data.age,
      idCardNumber: data.idCardNumber,
      contactNumber: data.contactNumber,
      idCard: data.idCard,
      parentApprovalLetter: data.parentApprovalLetter,
    });

    if (!parsed.success) {
      throw new Error("INVALID_HOME_CARD_REGISTRATION");
    }

    const db = getFirestoreDb();
    const homeCardSnapshot = await db
      .collection(COLLECTIONS.homeCards)
      .doc(homeCardId)
      .get();

    if (!homeCardSnapshot.exists || homeCardSnapshot.data()?.hidden) {
      throw new Error("HOME_CARD_NOT_FOUND");
    }

    const homeCard = fromFirestoreDoc<{
      title?: string;
      link?: string;
    }>(homeCardSnapshot);
    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.homeCardRegistrations).doc();

    await ref.set(
      toFirestoreData({
        ...parsed.data,
        homeCardId,
        homeCardTitle: homeCard.title || "",
        homeCardLink: homeCard.link || "",
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to create home-card registration:", error);

    if (
      error instanceof Error &&
      [
        "HOME_CARD_NOT_FOUND",
        "INVALID_HOME_CARD_REGISTRATION",
      ].includes(error.message)
    ) {
      throw error;
    }

    throw new Error("Failed to create home-card registration");
  }
};

export const getAllHomeCardRegistrations = async (
  limit: number,
  offset: number,
  searchTerm = ""
) => {
  try {
    const snapshot = await getFirestoreDb()
      .collection(COLLECTIONS.homeCardRegistrations)
      .get();
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const documents = snapshot.docs
      .map((doc) => fromFirestoreDoc<HomeCardRegistration>(doc))
      .sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return (
          (Number.isNaN(bTime) ? 0 : bTime) -
          (Number.isNaN(aTime) ? 0 : aTime)
        );
      });

    const filteredDocuments = normalizedSearch
      ? documents.filter((registration) =>
          [
            registration.homeCardTitle,
            registration.fullName,
            registration.idCardNumber,
            registration.contactNumber,
          ].some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(normalizedSearch)
          )
        )
      : documents;

    const safeLimit = Number.isFinite(limit) && limit > 0
      ? Math.min(Math.max(Math.floor(limit), 1), 100)
      : filteredDocuments.length;
    const safeOffset = Number.isFinite(offset)
      ? Math.max(Math.floor(offset), 0)
      : 0;

    return parseStringify({
      documents: filteredDocuments.slice(safeOffset, safeOffset + safeLimit),
      total: filteredDocuments.length,
    });
  } catch (error) {
    console.error("Failed to fetch home-card registrations:", error);
    throw new Error("Failed to fetch home-card registrations");
  }
};

export const getHomeCardRegistrationsForExport = async (searchTerm = "") => {
  return getAllHomeCardRegistrations(0, 0, searchTerm);
};

export const getHomeCardByLink = async (link: string) => {
  try {
    const trimmedLink = link.trim();
    if (!trimmedLink) return null;

    const pathWithoutQuery = trimmedLink.split(/[?#]/, 1)[0];
    const normalizedLink = pathWithoutQuery.startsWith("/")
      ? pathWithoutQuery
      : `/${pathWithoutQuery}`;
    const candidates = Array.from(
      new Set([
        trimmedLink,
        pathWithoutQuery,
        normalizedLink,
        normalizedLink.slice(1),
      ])
    );
    const collection = getFirestoreDb().collection(COLLECTIONS.homeCards);

    for (const candidate of candidates) {
      const snapshot = await collection
        .where("link", "==", candidate)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        return parseStringify(fromFirestoreDoc(snapshot.docs[0]));
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch Home Card by link:", error);
    throw new Error("Failed to fetch Home Card by link");
  }
};

export const updateCardVisibility = async (id: string, hidden: boolean) => {
  try {
    const ref = getFirestoreDb().collection(COLLECTIONS.homeCards).doc(id);
    await ref.update({ hidden, updatedAt: nowIso() });
    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to update visibility:", error);
    throw new Error("Failed to update visibility");
  }
};

export const deleteHomeCompetitionsCard = async (
  cardId: string,
  imageId: string
) => {
  try {
    await getFirestoreDb().collection(COLLECTIONS.homeCards).doc(cardId).delete();
    await deleteFileFromR2(imageId);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete card or image:", error);
    throw new Error("Failed to delete card or image");
  }
};
