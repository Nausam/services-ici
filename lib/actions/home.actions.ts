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
import { deleteFileFromR2, uploadFileToR2 } from "@/lib/r2/files";

type CreateHomeCompetitionsCardParams = {
  title: string;
  description: string;
  link: string;
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

    await ref.set(
      toFirestoreData({
        ...data,
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
    await ref.update(
      toFirestoreData({
        ...data,
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
