"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { constructFileUrlQuran, parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { HuthubaBangiCompetitionRegistration } from "@/types";

// UPLOAD PRODUCT IMAGE
export const uploadImage = async (file: File): Promise<string> => {
  const { storage } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    // Define permissions
    const permissions = [Permission.read(Role.any())];

    const bucketFile = await storage.createFile(
      appwriteConfig.quranCompetitionBucket,
      ID.unique(),
      inputFile,
      permissions
    );

    const fileDocument = {
      name: bucketFile.name,
      url: constructFileUrlQuran(bucketFile.$id),
      size: bucketFile.sizeOriginal,
      bucketFileId: bucketFile.$id,
    };

    return fileDocument.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

export const createHuthubaBangiCompetitionRegistration = async (
  registration: HuthubaBangiCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();

    const HuthubaBangiCompetitionRegistration = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      documentId,

      { ...registration }
    );

    return parseStringify(HuthubaBangiCompetitionRegistration);
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

export const getHuthubaBangiParticipantByIdCard = async (
  idCardNumber: string
) => {
  const { databases } = await createAdminClient();

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      [Query.equal("idCardNumber", idCardNumber)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch Quran participant:", error);
    return null;
  }
};

export const getAllHuthubaBangiCompetitionRegistrations = async (
  limit: number,
  offset: number
) => {
  try {
    const { databases } = await createAdminClient();

    const huthubaBangiCompetitionRegistrations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      [
        // Appwrite's pagination queries
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    return {
      documents: parseStringify(huthubaBangiCompetitionRegistrations.documents),
      total: huthubaBangiCompetitionRegistrations.total,
    };
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const updateHuthubaBangiCompetitionRegistration = async (
  idCardNumber: string, // ✅ Use idCardNumber as the identifier
  data: HuthubaBangiCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();

    // ✅ Get the document by idCardNumber first
    const existingDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      [Query.equal("idCardNumber", idCardNumber)]
    );

    if (existingDocs.documents.length === 0) {
      throw new Error("No document found for the given idCardNumber");
    }

    const documentId = existingDocs.documents[0].$id; // ✅ Get the document ID

    // ✅ Update the document
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      documentId,
      data
    );

    return parseStringify(updatedDocument);
  } catch (error) {
    console.error("Failed to update registration:", error);
    throw new Error("Failed to update registration");
  }
};

export const deleteHuthubaBangiCompetitionRegistration = async (
  idCardNumber: string
) => {
  try {
    const { databases } = await createAdminClient();

    // ✅ Get the document ID using the idCardNumber
    const existingDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      [Query.equal("idCardNumber", idCardNumber)]
    );

    if (existingDocs.documents.length === 0) {
      throw new Error("No document found for the given idCardNumber");
    }

    const documentId = existingDocs.documents[0].$id;

    // ✅ Delete the document
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      documentId
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete registration:", error);
    throw new Error("Failed to delete registration");
  }
};
