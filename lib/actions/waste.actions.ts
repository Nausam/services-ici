"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { constructFileUrl, parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";

type CreateRegistrationParams = {
  fullName: string;
  address: string;
  contactNumber: string;
  idCard: string;
  category: string;
};

// CREATE FINS
export const createRegistration = async ({
  fullName,
  address,
  contactNumber,
  idCard,
  category,
}: CreateRegistrationParams) => {
  try {
    const { databases } = await createAdminClient();

    const documentId = ID.unique();

    const resgistration = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.wasteManagementFormsId,
      documentId,
      {
        fullName,
        address,
        contactNumber,
        idCard,
        category,
        // createdAt: new Date().toISOString(),
      }
    );

    return parseStringify(resgistration);
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

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
