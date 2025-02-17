"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "node-appwrite";
import { parseStringify } from "../utils";

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

    // Query for today's quiz question
    const quizResult = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionId,
      [
        Query.greaterThanEqual("date", formattedStart),
        Query.lessThanEqual("date", formattedEnd),
      ]
    );

    if (quizResult.total === 0) {
      throw new Error("No quiz question found for today.");
    }

    const quizQuestion = quizResult.documents[0]; // Today's quiz
    const correctAnswer = quizQuestion.correctAnswer; // Correct answer field from the database
    const isCorrect = quizData.answer.trim() === correctAnswer.trim(); // Compare user's answer

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
    if (idCardMatches.total > 0) {
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
        questionNumber: quizQuestion.questionNumber,
        correct: isCorrect,
      }
    );

    return response;
  } catch (error) {
    console.error("❌ Failed to submit quiz form:", error);
    throw error; // Pass the error to the frontend for handling
  }
};

// GET ALL QUIZ SUBMISSIONS
export const getAllQuizSubmissions = async (limit: number, offset: number) => {
  try {
    const { databases } = await createAdminClient();

    const quizSubmissions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"), // Sort by latest submissions
      ]
    );

    return {
      documents: parseStringify(quizSubmissions.documents),
      total: quizSubmissions.total,
    };
  } catch (error) {
    console.error("Failed to fetch quiz submissions:", error);
    throw new Error("Failed to fetch quiz submissions");
  }
};

export const getQuizStatistics = async () => {
  try {
    const { databases } = await createAdminClient();

    // Fetch all quiz submissions (limit set high to fetch all)
    const submissions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [Query.limit(1000)]
    );

    if (submissions.total === 0) {
      return {
        dailyStats: {},
        topCorrect: null,
        topIncorrect: null,
      };
    }

    const dailyStats: Record<
      string,
      { total: number; correct: number; incorrect: number }
    > = {};
    const userCorrectCount: Record<string, number> = {};
    const userIncorrectCount: Record<string, number> = {};

    submissions.documents.forEach((submission: any) => {
      const { questionNumber, correct, fullName } = submission;

      // Track daily statistics
      if (!dailyStats[questionNumber]) {
        dailyStats[questionNumber] = { total: 0, correct: 0, incorrect: 0 };
      }

      dailyStats[questionNumber].total += 1;
      if (correct) {
        dailyStats[questionNumber].correct += 1;
        userCorrectCount[fullName] = (userCorrectCount[fullName] || 0) + 1;
      } else {
        dailyStats[questionNumber].incorrect += 1;
        userIncorrectCount[fullName] = (userIncorrectCount[fullName] || 0) + 1;
      }
    });

    // Find users with the most correct and incorrect answers
    const topCorrect = Object.entries(userCorrectCount).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    );

    const topIncorrect = Object.entries(userIncorrectCount).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    );

    return {
      dailyStats,
      topCorrect: topCorrect[0] || null,
      topIncorrect: topIncorrect[0] || null,
    };
  } catch (error) {
    console.error("Failed to fetch quiz statistics:", error);
    throw new Error("Failed to fetch quiz statistics");
  }
};
