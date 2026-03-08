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

// CREATE MADHAHA COMPETITION REGISTRATION (sets year for filtering, like Quran competition)
export const createMadhahaCompetitionRegistration = async (
  registration: MadhahaCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();
    const currentYear = String(new Date().getFullYear());

    // Prevent duplicate: same idCardNumber in the same year (skip if "year" not in collection)
    const idForCheck = (registration.idCardNumber || "").trim();
    if (idForCheck) {
      try {
        const checkExisting = async (id: string) =>
          databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.madhahaCompetitionId,
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
        const msg = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : "";
        if (msg === "ALREADY_REGISTERED_THIS_YEAR") throw err;
        // Year attribute may not exist in collection yet; skip duplicate check
      }
    }

    const data = { ...registration } as Record<string, unknown>;
    data.year = currentYear;

    let result;
    try {
      result = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.madhahaCompetitionId,
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
      const isYearInvalid = msg.includes("year");
      if (isYearInvalid) {
        const dataWithoutYear = { ...data };
        delete dataWithoutYear.year;
        result = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.madhahaCompetitionId,
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

const MADHAHA_DEFAULT_YEAR = "2025";

// Optional year: filter by registration year. Documents with no year are treated as 2025.
// If the collection has no "year" attribute, we fetch all and filter in memory.
export const getAllMadhahaCompetitionRegistrations = async (
  limit: number,
  offset: number,
  searchTerm?: string,
  year?: string
) => {
  const { databases } = await createAdminClient();

  const effectiveYear = (doc: { year?: string | null }) =>
    doc.year && String(doc.year).trim() ? String(doc.year) : MADHAHA_DEFAULT_YEAR;

  const fetchAllThenFilter = async () => {
    const all: unknown[] = [];
    const pageSize = 100;
    let totalFetched = 0;
    let hasMore = true;
    while (hasMore) {
      const queries = [
        Query.limit(pageSize),
        Query.offset(all.length),
      ];
      if (searchTerm) {
        queries.push(Query.search("idCardNumber", searchTerm));
      }
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.madhahaCompetitionId,
        queries
      );
      all.push(...res.documents);
      totalFetched = res.documents.length;
      hasMore = totalFetched === pageSize;
    }
    const filtered =
      year && year.trim()
        ? all.filter((d) => effectiveYear(d as { year?: string | null }) === year)
        : all;
    const total = filtered.length;
    const documents = filtered.slice(offset, offset + limit);
    return { documents, total };
  };

  if (year === MADHAHA_DEFAULT_YEAR) {
    try {
      const { documents, total } = await fetchAllThenFilter();
      return { documents, total };
    } catch (err) {
      console.error("Failed to fetch Madhaha registrations:", err);
      throw new Error("Failed to fetch Madhaha registrations");
    }
  }

  if (year && year.trim()) {
    try {
      const queries = [
        Query.equal("year", [year]),
        Query.limit(limit),
        Query.offset(offset),
      ];
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
    } catch (error: unknown) {
      const isYearQueryInvalid =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: string }).message === "string" &&
        (error as { message: string }).message.includes("year");

      if (isYearQueryInvalid) {
        const { documents, total } = await fetchAllThenFilter();
        return { documents, total };
      }
      console.error("Failed to fetch Madhaha registrations:", error);
      throw new Error("Failed to fetch Madhaha registrations");
    }
  }

  try {
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
  } catch (err) {
    console.error("Failed to fetch Madhaha registrations:", err);
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
