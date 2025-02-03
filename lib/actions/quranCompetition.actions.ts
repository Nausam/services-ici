"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { constructFileUrl, parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { QuranCompetitionRegistration } from "@/types";

// UPLOAD PRODUCT IMAGE
export const uploadImage = async (file: File): Promise<string> => {
  const { storage } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    // Define permissions
    const permissions = [Permission.read(Role.any())];

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
      permissions
    );

    const fileDocument = {
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      size: bucketFile.sizeOriginal,
      bucketFileId: bucketFile.$id,
    };

    return fileDocument.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

// CREATE WASTE MANAGEMENT SERVICE REGISTRATION REQUEST
export const createQuranCompetitionRegistration = async (
  registration: QuranCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();

    const QuranCompetitionRegistration = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId,
      documentId,

      { ...registration }
    );

    return parseStringify(QuranCompetitionRegistration);
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

// GET ALL QURAN COMPETITION REGISTRATIONS
export const getAllQuranCompetitionRegistrations = async () => {
  try {
    const { databases } = await createAdminClient();

    const quranCompetitionRegistrations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId
    );

    return parseStringify(quranCompetitionRegistrations.documents);
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

// Function to get a Quran competition registration by ID Card Number
export const getQuranRegistrationById = async (
  idCardNumber: string | string[] | undefined
) => {
  try {
    const { databases } = await createAdminClient();

    // Check if idCardNumber is a valid string
    if (!idCardNumber || Array.isArray(idCardNumber)) {
      throw new Error("Invalid ID card number provided.");
    }

    // Fetch the participant based on the ID card number
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId,
      [Query.equal("idCardNumber", [idCardNumber])] // Query expects an array
    );

    // Check if the participant exists
    if (response.total === 0) {
      throw new Error("Participant not found");
    }

    // Return the first matched document
    return response.documents[0];
  } catch (error) {
    console.error("Failed to fetch registration:", error);
    throw new Error("Failed to fetch participant details");
  }
};
