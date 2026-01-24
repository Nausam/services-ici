"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { constructFileUrlQuran, parseStringify } from "@/lib/utils";
import { InputFile } from "node-appwrite/file";
import { QuranCompetitionRegistration } from "@/types";
import nodemailer from "nodemailer";

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
export const createQuranCompetitionRegistration = async (
  registration: QuranCompetitionRegistration
) => {
  try {
    const { databases } = await createAdminClient();
    const documentId = ID.unique();
    const currentYear = String(new Date().getFullYear());

    // Prevent duplicate: same idCardNumber in the same year
    const idForCheck = (registration.idCardNumber || "").trim();
    if (idForCheck) {
      const checkExisting = async (id: string) =>
        databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.quranCompetitionId,
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
    }

    const data = { ...registration } as Record<string, unknown>;
    data.year = currentYear; // always set for new registrations (required in Appwrite)

    const QuranCompetitionRegistration = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId,
      documentId,
      data
    );

    // Send email notification after successful registration
    // await sendRegistrationEmail(registration);

    return parseStringify(QuranCompetitionRegistration);
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

// GET ALL QURAN COMPETITION REGISTRATIONS
// Optional year: filter by registration year (e.g. "2025"). Omit to get all years.
export const getAllQuranCompetitionRegistrations = async (
  limit: number,
  offset: number,
  year?: string
) => {
  try {
    const { databases } = await createAdminClient();

    const queries = [
      ...(year ? [Query.equal("year", [year])] : []),
      Query.limit(limit),
      Query.offset(offset),
    ];

    const quranCompetitionRegistrations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId,
      queries
    );

    return {
      documents: parseStringify(quranCompetitionRegistrations.documents),
      total: quranCompetitionRegistrations.total,
    };
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    throw new Error("Failed to fetch registrations");
  }
};

// Function to get a Quran competition registration by ID Card Number
// Tries exact match first, then without "A" prefix if not found (for legacy data)
// Returns the most recent registration when multiple exist (e.g. multiple years)
export const getQuranRegistrationById = async (
  idCardNumber: string | string[] | undefined
) => {
  try {
    const { databases } = await createAdminClient();

    // Check if idCardNumber is a valid string
    if (!idCardNumber || Array.isArray(idCardNumber)) {
      throw new Error("Invalid ID card number provided.");
    }

    const id = String(idCardNumber).trim();

    const fetchByCard = async (card: string) =>
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.quranCompetitionId,
        [
          Query.equal("idCardNumber", [card]),
          Query.orderDesc("$createdAt"),
          Query.limit(1),
        ]
      );

    let response = await fetchByCard(id);

    // If not found and id starts with "A", try without prefix (legacy data)
    if (response.total === 0 && id.startsWith("A")) {
      response = await fetchByCard(id.replace(/^A/, ""));
    }

    if (response.total === 0) {
      throw new Error("Participant not found");
    }

    return parseStringify(response.documents[0]);
  } catch (error) {
    console.error("Failed to fetch registration:", error);
    throw new Error("Failed to fetch participant details");
  }
};

// Configure Nodemailer (Gmail Example)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "hnaisam@gmail.com", // Replace with your email
//     pass: "tmdi cpxj pkng txbs", // Use an App Password if using Gmail
//   },
// });

// Send Email Notification
// const sendRegistrationEmail = async (
//   registration: QuranCompetitionRegistration
// ) => {
//   const mailOptions = {
//     from: '"Quran Competition"',
//     to: "hnaisam@gmail.com",
//     subject: `New Registration: ${registration.fullName}`,
//     html: `
//       <div style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
//         <h2 style="color: #0e7490; text-align: center; font-size: 24px; margin-bottom: 20px;"> އިންނަމާދޫ ކައުންސިލްގެ 8 ވަނަ ޤުރުއާން މުބާރާތް</h2>

//         <div style="background-color: #ffffff; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//           <p style="font-size: 16px; color: #333;"><strong>${registration.fullName}</strong> </p>
//           <p style="font-size: 16px; color: #333;"><strong>${registration.idCardNumber}</strong> </p>
//           <p style="font-size: 16px; color: #333;"><strong>${registration.contactNumber}</strong> </p>
//         </div>
//       </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully.");
//   } catch (error) {
//     console.error("Failed to send email:", error);
//   }
// };
