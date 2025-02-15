"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { constructFileUrlHome, parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";

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

// UPLOAD HOME CARD IMAGE
export const uploadImage = async (
  file: File
): Promise<{ url: string; id: string }> => {
  const { storage } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    // Define permissions
    const permissions = [Permission.read(Role.any())];

    const bucketFile = await storage.createFile(
      appwriteConfig.homeCardsImageBucket,
      ID.unique(),
      inputFile,
      permissions
    );

    // const fileDocument = {
    //   name: bucketFile.name,
    //   url: constructFileUrlHome(bucketFile.$id),
    //   size: bucketFile.sizeOriginal,
    //   bucketFileId: bucketFile.$id,
    // };

    return {
      url: constructFileUrlHome(bucketFile.$id),
      id: bucketFile.$id, // Return the file ID for future reference
    };
  } catch (error) {
    console.error("File upload failed:", error);
    throw new Error("Failed to upload file");
  }
};

// CREATE HOME COMPETITIONS CARD
export const createHomeCards = async ({
  title,
  description,
  link,
  buttonText,
  dueDate,
  image,
  hidden,
  imageId,
  category,
}: CreateHomeCompetitionsCardParams) => {
  try {
    const { databases } = await createAdminClient();

    console.log(
      "Service Card Collection ID:",
      appwriteConfig.homeCardsCollectionId
    );

    const documentId = ID.unique();

    const competitionsCard = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.homeCardsCollectionId,
      documentId,
      {
        title,
        description,
        link,
        buttonText,
        dueDate,
        image,
        hidden,
        imageId,
        category,
      }
    );

    return parseStringify(competitionsCard);
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

// GET ALL CARDS BY CATEGORY
export const getAllCardsByCategory = async (
  category: string,
  limit: number,
  offset: number
) => {
  try {
    const { databases } = await createAdminClient();

    // Log the collection ID and category for debugging
    console.log("Database ID:", appwriteConfig.databaseId);
    console.log("Collection ID:", appwriteConfig.homeCardsCollectionId);
    console.log("Category:", category);

    const filteredCards = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.homeCardsCollectionId, // Ensure this value is correct
      [
        Query.equal("category", category),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

    return {
      documents: parseStringify(filteredCards.documents),
      total: filteredCards.total,
    };
  } catch (error) {
    console.error("Failed to fetch cards by category:", error);
    throw new Error("Failed to fetch cards by category");
  }
};

// UPDATE COMPETITION CARD
export const updateHomeCards = async (
  id: string,
  data: CreateHomeCompetitionsCardParams
) => {
  try {
    const { databases } = await createAdminClient();

    const updatedCard = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.homeCardsCollectionId,
      id,
      data
    );

    return parseStringify(updatedCard);
  } catch (error) {
    console.error("Failed to update card:", error);
    throw new Error("Failed to update card");
  }
};

// GET COMPETITION CARD BY ID
export const getHomeCompetitionsCardById = async (id: string) => {
  try {
    const { databases } = await createAdminClient();

    const homeCard = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.homeCardsCollectionId,
      id
    );

    return parseStringify(homeCard);
  } catch (error) {
    console.error("Failed to fetch Home Card:", error);
    throw new Error("Failed to fetch Home Card");
  }
};

// UPDATE VISIBILITY OF COMPETITION CARD
export const updateCardVisibility = async (id: string, hidden: boolean) => {
  const { databases } = await createAdminClient();
  try {
    const updatedCard = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.homeCardsCollectionId,
      id,
      { hidden }
    );
    return updatedCard;
  } catch (error) {
    console.error("Failed to update visibility:", error);
    throw new Error("Failed to update visibility");
  }
};

// DELETE COMPETITION CARD
export const deleteHomeCompetitionsCard = async (
  cardId: string,
  imageId: string
) => {
  const { databases, storage } = await createAdminClient();

  try {
    // Delete the card document
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.homeCardsCollectionId,
      cardId
    );

    // Delete the image from the bucket
    if (imageId) {
      await storage.deleteFile(appwriteConfig.homeCardsImageBucket, imageId);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete card or image:", error);
    throw new Error("Failed to delete card or image");
  }
};
