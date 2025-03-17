"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import * as XLSX from "xlsx";

interface QuizQuestion {
  questionNumber: string;
  question: string;
  options: string[];
  correctAnswer: string;
  date: string;
}

type TopUser = {
  idCardNumber: string;
  name: string;
  count: number;
};

type QuizStatistics = {
  dailyStats: Record<
    string,
    { total: number; correct: number; incorrect: number }
  >;
  topUsers: TopUser[];
  topCorrect: TopUser[];
  topIncorrect: TopUser[];
};

export const getTodaysQuizQuestion = async () => {
  try {
    const { databases } = await createAdminClient();

    // ✅ Convert to Maldives Time (UTC+5)
    const maldivesNow = new Date();
    maldivesNow.setUTCHours(maldivesNow.getUTCHours() + 5); // Shift to UTC+5

    const todayStart = new Date(maldivesNow);
    todayStart.setUTCHours(0, 0, 0, 0); // Start of the day in UTC+5

    const todayEnd = new Date(maldivesNow);
    todayEnd.setUTCHours(23, 59, 59, 999); // End of the day in UTC+5

    // ✅ Convert to ISO format (UTC format for Appwrite)
    const formattedStart = todayStart.toISOString();
    const formattedEnd = todayEnd.toISOString();

    // ✅ Query today's quiz based on Maldives Time
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
        questionNumber: result.documents[0].questionNumber,
        correctAnswer: result.documents[0].correctAnswer,
        options: result.documents[0].options || [],
      };
    }

    // ✅ If no quiz for today, fetch the next available quiz
    const nextQuiz = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionId,
      [Query.greaterThan("date", formattedEnd), Query.limit(1)]
    );

    if (nextQuiz.total > 0) {
      return {
        nextQuizDate: nextQuiz.documents[0].date,
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

    // ✅ Convert current time to Maldives Time (UTC+5)
    const maldivesNow = new Date();
    maldivesNow.setUTCHours(maldivesNow.getUTCHours() + 5); // Shift to UTC+5

    const todayStart = new Date(maldivesNow);
    todayStart.setUTCHours(0, 0, 0, 0); // Midnight start

    const todayEnd = new Date(maldivesNow);
    todayEnd.setUTCHours(23, 59, 59, 999); // Midnight end

    // ✅ Convert to ISO format for Appwrite
    const formattedStart = todayStart.toISOString();
    const formattedEnd = todayEnd.toISOString();

    console.log("🌍 Maldives Today Start (UTC):", formattedStart);
    console.log("🌍 Maldives Today End (UTC):", formattedEnd);

    // ✅ Query for today's quiz question
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

    // ✅ Query for existing submissions matching idCardNumber
    const idCardMatches = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [
        Query.equal("idCardNumber", quizData.idCardNumber),
        Query.greaterThanEqual("submissionDate", formattedStart),
        Query.lessThanEqual("submissionDate", formattedEnd),
      ]
    );

    // ✅ If the user has already submitted today, prevent multiple submissions
    if (idCardMatches.total > 0) {
      return {
        success: false,
        message:
          "A submission already exists for today's quiz with matching details. Please try again tomorrow.",
      };
    }

    // ✅ Store new submission in Maldives Time (UTC+5)
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      "unique()", // Generate a unique document ID
      {
        fullName: quizData.fullName,
        contactNumber: quizData.contactNumber,
        idCardNumber: quizData.idCardNumber,
        answer: quizData.answer,
        submissionDate: todayStart.toISOString(), // ✅ Corrected Maldives Time Submission Date
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
export const getAllQuizSubmissions = async (
  limit: number,
  offset: number,
  selectedDate?: string
) => {
  try {
    const { databases } = await createAdminClient();

    const filters = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("$createdAt"),
    ];

    if (selectedDate) {
      const startDate = new Date(selectedDate);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setUTCHours(23, 59, 59, 999);

      filters.push(
        Query.greaterThanEqual("submissionDate", startDate.toISOString())
      );
      filters.push(
        Query.lessThanEqual("submissionDate", endDate.toISOString())
      );
    }

    const quizSubmissions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      filters
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

export const getQuizStatistics = async (): Promise<QuizStatistics> => {
  try {
    const { databases } = await createAdminClient();

    // ✅ Step 1: Get Total Number of Questions
    const quizQuestions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionId,
      [Query.limit(5000)] // ⬆️ Increased limit for more data
    );

    const totalQuestionsCount = quizQuestions.total;
    console.log("✅ Total Quiz Questions:", totalQuestionsCount);

    if (totalQuestionsCount === 0) {
      throw new Error("No quiz questions found.");
    }

    // ✅ Step 2: Get All Submissions
    const submissions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [Query.limit(5000)] // ⬆️ Increased Limit to Ensure All Entries Are Fetched
    );

    if (submissions.total === 0) {
      return {
        dailyStats: {},
        topUsers: [],
        topCorrect: [],
        topIncorrect: [],
      };
    }

    // ✅ Step 3: Initialize Stats
    const dailyStats: Record<
      string,
      { total: number; correct: number; incorrect: number }
    > = {};

    const userCorrectCount: Record<
      string,
      { fullName: string; count: number }
    > = {};

    const userIncorrectCount: Record<
      string,
      { fullName: string; count: number }
    > = {};

    // ✅ Step 4: Process Submission Data
    submissions.documents.forEach((submission: any) => {
      let { questionNumber, correct, idCardNumber, fullName } = submission;

      // ✅ Clean Data
      questionNumber = questionNumber.trim();

      // ✅ Track daily stats
      if (!dailyStats[questionNumber]) {
        dailyStats[questionNumber] = { total: 0, correct: 0, incorrect: 0 };
      }

      dailyStats[questionNumber].total += 1;

      if (correct) {
        dailyStats[questionNumber].correct += 1;

        // ✅ Track user's correct count
        if (!userCorrectCount[idCardNumber]) {
          userCorrectCount[idCardNumber] = { fullName, count: 0 };
        }
        userCorrectCount[idCardNumber].count += 1;
      } else {
        dailyStats[questionNumber].incorrect += 1;

        // ✅ Track user's incorrect count
        if (!userIncorrectCount[idCardNumber]) {
          userIncorrectCount[idCardNumber] = { fullName, count: 0 };
        }
        userIncorrectCount[idCardNumber].count += 1;
      }
    });

    // ✅ Step 5: Identify Current Question Day (based on answered questions)
    const currentDayCount = Math.max(
      ...Object.keys(dailyStats).map((q) => parseInt(q))
    );
    console.log("✅ Current Question Day:", currentDayCount);

    // ✅ Step 6: Top Correct Answers (No Limit)
    const topCorrect: TopUser[] = Object.entries(userCorrectCount)
      .map(([idCardNumber, data]) => ({
        idCardNumber,
        name: data.fullName,
        count: data.count,
      }))
      // ✅ Sort highest to lowest correct answers
      .sort((a, b) => b.count - a.count);

    // ✅ Step 7: Keep Top Scorers Based on Current Day Count
    const highestCount =
      topCorrect.find((user) => user.count <= currentDayCount)?.count || 0;

    console.log("✅ Highest Count (based on current day):", highestCount);

    const filteredTopCorrect = topCorrect.filter(
      (user) => user.count === highestCount
    );

    console.log("✅ Filtered Top Correct:", filteredTopCorrect);

    // ✅ Step 8: Top Incorrect Answers (Top 5)
    const topIncorrect: TopUser[] = Object.entries(userIncorrectCount)
      .map(([idCardNumber, data]) => ({
        idCardNumber,
        name: data.fullName,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log("✅ Top Incorrect:", topIncorrect);

    return {
      dailyStats,
      topUsers: filteredTopCorrect, // ✅ Show only highest-scoring participants
      topCorrect: filteredTopCorrect, // ✅ Show only highest-scoring participants
      topIncorrect,
    };
  } catch (error) {
    console.error("❌ Failed to fetch quiz statistics:", error);
    throw new Error("Failed to fetch quiz statistics");
  }
};

export const uploadQuizQuestions = async (questions: QuizQuestion[]) => {
  try {
    const { databases } = await createAdminClient();

    for (const question of questions) {
      if (!Array.isArray(question.options)) {
        throw new Error(
          `Invalid options format for question: ${question.question}`
        );
      }

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.quizCompetitionId,
        ID.unique(),
        {
          questionNumber: question.questionNumber,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          date: question.date,
        }
      );
    }

    return { success: true, message: "Quiz questions uploaded successfully!" };
  } catch (error) {
    console.error("❌ Failed to upload quiz questions:", error);
    throw new Error("Failed to upload quiz questions.");
  }
};

export const getQuizSubmissionsById = async (
  idCardNumber: string | string[] | undefined
) => {
  try {
    const { databases } = await createAdminClient();

    if (!idCardNumber || Array.isArray(idCardNumber)) {
      throw new Error("Invalid ID card number provided.");
    }

    // ✅ Fetch all submissions by the same user
    const submissionResult = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionAnswersId,
      [Query.equal("idCardNumber", idCardNumber)]
    );

    if (submissionResult.total === 0) {
      throw new Error("No submissions found.");
    }

    const submissions = submissionResult.documents;

    // ✅ Fetch related questions for all submissions
    const questionNumbers = submissions.map(
      (submission) => submission.questionNumber
    );

    if (questionNumbers.length === 0) {
      throw new Error("No questions found for submissions.");
    }

    const questionResult = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quizCompetitionId,
      [Query.equal("questionNumber", questionNumbers)]
    );

    const questionMap = questionResult.documents.reduce((map, question) => {
      map[question.questionNumber] = question.question;
      return map;
    }, {} as Record<string, string>);

    // ✅ Attach questionText to each submission
    const detailedSubmissions = submissions.map((submission) => ({
      ...submission,
      questionText: questionMap[submission.questionNumber] || "ސުވާލު ނުފެނުނު",
    }));

    return detailedSubmissions;
  } catch (error) {
    console.error("Failed to fetch quiz submissions:", error);
    throw new Error("Failed to fetch quiz submissions.");
  }
};
