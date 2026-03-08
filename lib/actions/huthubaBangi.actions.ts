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

const HUTHUBA_BANGI_DEFAULT_YEAR = "2025";

export const createHuthubaBangiCompetitionRegistration = async (
  registration: HuthubaBangiCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();
    const currentYear = String(new Date().getFullYear());

    // Optional duplicate check: same idCardNumber in same year (skip if "year" not in collection)
    const idForCheck = (registration.idCardNumber || "").trim();
    if (idForCheck) {
      try {
        const checkExisting = async (id: string) =>
          databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.HuthubaBangiCompetitionId,
            [
              Query.equal("idCardNumber", [id]),
              Query.equal("year", [currentYear]),
              Query.limit(1),
            ]
          );
        let existing = await checkExisting(idForCheck);
        if (existing.total === 0 && idForCheck.startsWith("A")) {
          existing = await checkExisting(idForCheck.replace(/^A/, ""));
        }
        if (existing.total > 0) {
          throw new Error("ALREADY_REGISTERED_THIS_YEAR");
        }
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "";
        if (msg === "ALREADY_REGISTERED_THIS_YEAR") throw err;
      }
    }

    const data = { ...registration } as Record<string, unknown>;
    data.year = currentYear;

    let result;
    try {
      result = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.HuthubaBangiCompetitionId,
        documentId,
        data
      );
    } catch (createError: unknown) {
      const msg =
        createError &&
        typeof createError === "object" &&
        "message" in createError
          ? String((createError as { message: unknown }).message)
          : "";
      if (msg.includes("year")) {
        const dataWithoutYear = { ...data };
        delete dataWithoutYear.year;
        result = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.HuthubaBangiCompetitionId,
          documentId,
          dataWithoutYear
        );
      } else {
        throw createError;
      }
    }

    return parseStringify(result);
  } catch (error) {
    console.error("Failed to register:", error);
    if (
      error instanceof Error &&
      error.message === "ALREADY_REGISTERED_THIS_YEAR"
    ) {
      throw error;
    }
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

// Optional year: filter by registration year. Documents with no year are treated as 2025.
export const getAllHuthubaBangiCompetitionRegistrations = async (
  limit: number,
  offset: number,
  year?: string
) => {
  const { databases } = await createAdminClient();

  const effectiveYear = (doc: { year?: string | null }) =>
    doc.year && String(doc.year).trim()
      ? String(doc.year)
      : HUTHUBA_BANGI_DEFAULT_YEAR;

  const fetchAllThenFilter = async () => {
    const all: unknown[] = [];
    const pageSize = 100;
    let hasMore = true;
    while (hasMore) {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.HuthubaBangiCompetitionId,
        [Query.limit(pageSize), Query.offset(all.length)]
      );
      all.push(...res.documents);
      hasMore = res.documents.length === pageSize;
    }
    const filtered =
      year && year.trim()
        ? all.filter(
            (d) => effectiveYear(d as { year?: string | null }) === year
          )
        : all;
    return {
      documents: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  };

  if (year === HUTHUBA_BANGI_DEFAULT_YEAR) {
    try {
      return await fetchAllThenFilter();
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
      throw new Error("Failed to fetch registrations");
    }
  }

  if (year && year.trim()) {
    try {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.HuthubaBangiCompetitionId,
        [
          Query.equal("year", [year]),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
      return {
        documents: parseStringify(result.documents),
        total: result.total,
      };
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : "";
      if (msg.includes("year")) {
        return await fetchAllThenFilter();
      }
      console.error("Failed to fetch registrations:", error);
      throw new Error("Failed to fetch registrations");
    }
  }

  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.HuthubaBangiCompetitionId,
      [Query.limit(limit), Query.offset(offset)]
    );
    return {
      documents: parseStringify(result.documents),
      total: result.total,
    };
  } catch (err) {
    console.error("Failed to fetch registrations:", err);
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
