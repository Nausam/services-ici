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

    const QuranCompetitionRegistration = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId,
      documentId,

      { ...registration }
    );

    // Send email notification after successful registration
    // await sendRegistrationEmail(registration);

    return parseStringify(QuranCompetitionRegistration);
  } catch (error) {
    console.error("Failed to register:", error);
    throw new Error("Failed to register");
  }
};

// GET ALL QURAN COMPETITION REGISTRATIONS
export const getAllQuranCompetitionRegistrations = async (
  limit: number,
  offset: number
) => {
  try {
    const { databases } = await createAdminClient();

    const quranCompetitionRegistrations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quranCompetitionId,
      [
        // Appwrite's pagination queries
        Query.limit(limit),
        Query.offset(offset),
      ]
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
