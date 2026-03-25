"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { CouncilAwardRegistration } from "@/types";

export const createCouncilAwardRegistration = async (
  registration: CouncilAwardRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();
    const currentYear = String(new Date().getFullYear());

    const idForCheck = (registration.idCardNumber || "").trim();
    if (idForCheck) {
      const existing = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.councilAwardCollectionId,
        [
          Query.equal("idCardNumber", [idForCheck]),
          Query.equal("year", [currentYear]),
          Query.limit(1),
        ]
      );
      if (existing.total > 0) {
        throw new Error("ALREADY_REGISTERED_THIS_YEAR");
      }
    }

    const result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.councilAwardCollectionId,
      documentId,
      {
        fullName: registration.fullName,
        idCardNumber: registration.idCardNumber,
        category: registration.category,
        startDate: registration.startDate || null,
        endDate: registration.endDate || null,
        examDate: registration.examDate || null,
        description: registration.description,
        year: currentYear,
      }
    );

    return parseStringify(result);
  } catch (error) {
    console.error("Failed to register council award:", error);
    if (
      error instanceof Error &&
      error.message === "ALREADY_REGISTERED_THIS_YEAR"
    ) {
      throw error;
    }
    throw new Error("Failed to register");
  }
};

export const getAllCouncilAwardRegistrations = async (
  limit: number,
  offset: number,
  year?: string
) => {
  try {
    const { databases } = await createAdminClient();

    const queries = [Query.limit(limit), Query.offset(offset)];
    if (year && year.trim()) queries.push(Query.equal("year", [year]));

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.councilAwardCollectionId,
      queries
    );

    return {
      documents: parseStringify(result.documents),
      total: result.total,
    };
  } catch (error) {
    console.error("Failed to fetch council award registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const deleteCouncilAwardRegistration = async (documentId: string) => {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.councilAwardCollectionId,
      documentId
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to delete council award registration:", error);
    throw new Error("Failed to delete registration");
  }
};
