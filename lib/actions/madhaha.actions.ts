"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { constructFileUrlQuran, parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { MadhahaCompetitionRegistration } from "@/types";

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

// CREATE WASTE MANAGEMENT SERVICE REGISTRATION REQUEST
export const createMadhahaCompetitionRegistration = async (
  registration: MadhahaCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();

    const MadhahaCompetitionRegistration = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.madhahaCompetitionId,
      documentId,

      { ...registration }
    );

    // Send email notification after successful registration
    // await sendRegistrationEmail(registration);

    return parseStringify(MadhahaCompetitionRegistration);
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

export const getQuranParticipantByIdCard = async (idCardNumber: string) => {
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

export const getMadhahaParticipantByDocumentId = async (documentId: string) => {
  const { databases } = await createAdminClient();

  try {
    const doc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.madhahaCompetitionId,
      documentId
    );

    return doc;
  } catch (error) {
    console.error("Failed to fetch by doc id:", error);
    return null;
  }
};

export const getAllMadhahaCompetitionRegistrations = async (
  limit: number,
  offset: number,
  searchTerm?: string
) => {
  try {
    const { databases } = await createAdminClient();

    const queries = [Query.limit(limit), Query.offset(offset)];

    if (searchTerm) {
      queries.push(Query.search("idCardNumber", searchTerm));
    }

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.madhahaCompetitionId,
      queries
    );

    return {
      documents: result.documents,
      total: result.total,
    };
  } catch (error) {
    console.error("Failed to fetch Madhaha registrations:", error);
    throw new Error("Failed to fetch Madhaha registrations");
  }
};

export const updateMadhahaCompetitionRegistration = async (
  $id: string,
  data: MadhahaCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();

    // ✅ Get the document by idCardNumber first
    const existingDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.madhahaCompetitionId,
      [Query.equal("$id", $id)]
    );

    if (existingDocs.documents.length === 0) {
      throw new Error("No document found for the given idCardNumber");
    }

    const documentId = existingDocs.documents[0].$id; // ✅ Get the document ID

    // ✅ Update the document
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.madhahaCompetitionId,
      documentId,
      data
    );

    return parseStringify(updatedDocument);
  } catch (error) {
    console.error("Failed to update registration:", error);
    throw new Error("Failed to update registration");
  }
};
