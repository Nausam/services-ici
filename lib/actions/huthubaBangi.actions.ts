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
      appwriteConfig.quranCompetitionId,
      [Query.equal("idCardNumber", idCardNumber)]
    );

    if (response.documents.length > 0) {
      return response.documents[0]; // ✅ Return the existing participant
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch Quran participant:", error);
    return null;
  }
};
