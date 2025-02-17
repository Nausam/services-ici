"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "node-appwrite";

export const getTodaysQuizQuestion = async () => {
  try {
    const { databases } = await createAdminClient();

    // Get today's full date range in ISO format
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0); // Set to start of the day
    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999); // Set to end of the day

    const formattedStart = todayStart.toISOString();
    const formattedEnd = todayEnd.toISOString();

    // Query for today's quiz within the full day range
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionId,
      [
        Query.greaterThanEqual("date", formattedStart),
        Query.lessThanEqual("date", formattedEnd),
      ]
    );

    if (result.total > 0) {
      return {
        date: result.documents[0].date,
        question: result.documents[0].question,
        options: result.documents[0].options || [],
      };
    }

    return null;
  } catch (error) {
    console.error("❌ Failed to fetch today's quiz question:", error);
    return null;
  }
};

export const submitQuizForm = async (quizData: {
  fullName: string;
  contactNumber: string;
  idCardNumber: string;
  answer: string;
}) => {
  try {
    const { databases } = await createAdminClient();

    // Get today's date range in UTC to check for existing submissions
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0); // Start of the day UTC
    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999); // End of the day UTC

    const formattedStart = todayStart.toISOString();
    const formattedEnd = todayEnd.toISOString();

    // Query for existing submissions matching fullName
    const nameMatches = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [
        Query.equal("fullName", quizData.fullName),
        Query.greaterThanEqual("submissionDate", formattedStart),
        Query.lessThanEqual("submissionDate", formattedEnd),
      ]
    );

    // Query for existing submissions matching contactNumber
    const contactMatches = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [
        Query.equal("contactNumber", quizData.contactNumber),
        Query.greaterThanEqual("submissionDate", formattedStart),
        Query.lessThanEqual("submissionDate", formattedEnd),
      ]
    );

    // Query for existing submissions matching idCardNumber
    const idCardMatches = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [
        Query.equal("idCardNumber", quizData.idCardNumber),
        Query.greaterThanEqual("submissionDate", formattedStart),
        Query.lessThanEqual("submissionDate", formattedEnd),
      ]
    );

    // Check if there are any matches in any of the queries
    if (
      nameMatches.total > 0 ||
      contactMatches.total > 0 ||
      idCardMatches.total > 0
    ) {
      return {
        success: false,
        message:
          "A submission already exists for today's quiz with matching details. Please try again tomorrow.",
      };
    }

    // Create a new submission document
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      "unique()", // Generate a unique document ID
      {
        fullName: quizData.fullName,
        contactNumber: quizData.contactNumber,
        idCardNumber: quizData.idCardNumber,
        answer: quizData.answer,
        submissionDate: new Date().toISOString(), // Use UTC time
      }
    );

    return response;
  } catch (error) {
    console.error("❌ Failed to submit quiz form:", error);
    throw error; // Pass the error to the frontend for handling
  }
};
