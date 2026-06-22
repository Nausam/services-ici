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
import { uploadFileToR2 } from "@/lib/r2/files";

type CreateRegistrationParams = {
  fullName: string;
  address: string;
  contactNumber: string;
  idCard: string;
  idCardNumber: string;
  category: string;
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const uploaded = await uploadFileToR2(file, "waste-management/id-cards");
    return uploaded.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

export const createRegistration = async ({
  fullName,
  address,
  contactNumber,
  idCard,
  idCardNumber,
  category,
}: CreateRegistrationParams) => {
  try {
    const db = getFirestoreDb();
    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.wasteManagementForms).doc();

    await ref.set(
      toFirestoreData({
        fullName,
        address,
        contactNumber,
        idCard,
        idCardNumber,
        category,
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

export const getAllRegistrations = async (limit: number, offset: number) => {
  try {
    const collection = getFirestoreDb().collection(
      COLLECTIONS.wasteManagementForms
    );
    const result = await getPagedDocuments({
      baseQuery: collection,
      pagedQuery: collection.limit(limit).offset(offset),
    });

    return parseStringify(result);
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const getWasteRegistrationById = async (
  idCardNumber: string | string[] | undefined
) => {
  try {
    if (!idCardNumber || Array.isArray(idCardNumber)) {
      throw new Error("Invalid ID card number provided.");
    }

    const snapshot = await getFirestoreDb()
      .collection(COLLECTIONS.wasteManagementForms)
      .where("idCardNumber", "==", idCardNumber)
      .get();

    if (snapshot.empty) {
      throw new Error("Participant not found");
    }

    return parseStringify({
      documents: snapshot.docs.map((doc) => fromFirestoreDoc(doc)),
      total: snapshot.size,
    });
  } catch (error) {
    console.error("Failed to fetch registration:", error);
    throw new Error("Failed to fetch participant details");
  }
};
