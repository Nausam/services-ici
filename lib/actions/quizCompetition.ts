"use server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fromFirestoreDoc,
  getPagedDocuments,
  nowIso,
  toFirestoreData,
} from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";
import { QUIZ_COMPETITION_DEFAULT_YEAR } from "@/constants";
import { parseStringify } from "../utils";
import { getQuranParticipantByIdCard } from "./madhaha.actions";

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

const getTodayMaldivesWindow = () => {
  const maldivesNow = new Date();
  maldivesNow.setUTCHours(maldivesNow.getUTCHours() + 5);

  const todayStart = new Date(maldivesNow);
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date(maldivesNow);
  todayEnd.setUTCHours(23, 59, 59, 999);

  return {
    formattedStart: todayStart.toISOString(),
    formattedEnd: todayEnd.toISOString(),
    todayStart,
  };
};

export const getTodaysQuizQuestion = async () => {
  try {
    const db = getFirestoreDb();
    const { formattedStart, formattedEnd } = getTodayMaldivesWindow();

    const result = await db
      .collection(COLLECTIONS.quizQuestions)
      .where("date", ">=", formattedStart)
      .where("date", "<=", formattedEnd)
      .orderBy("date", "asc")
      .limit(1)
      .get();

    if (!result.empty) {
      const question = result.docs[0].data();
      return {
        date: question.date,
        question: question.question,
        questionNumber: question.questionNumber,
        correctAnswer: question.correctAnswer,
        options: question.options || [],
      };
    }

    const nextQuiz = await db
      .collection(COLLECTIONS.quizQuestions)
      .where("date", ">", formattedEnd)
      .orderBy("date", "asc")
      .limit(1)
      .get();

    if (!nextQuiz.empty) {
      return {
        nextQuizDate: nextQuiz.docs[0].data().date,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch today's quiz question:", error);
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
    const db = getFirestoreDb();
    const { formattedStart, formattedEnd, todayStart } =
      getTodayMaldivesWindow();

    const quizResult = await db
      .collection(COLLECTIONS.quizQuestions)
      .where("date", ">=", formattedStart)
      .where("date", "<=", formattedEnd)
      .orderBy("date", "asc")
      .limit(1)
      .get();

    if (quizResult.empty) {
      throw new Error("No quiz question found for today.");
    }

    const quizQuestion = quizResult.docs[0].data();
    const correctAnswer = String(quizQuestion.correctAnswer || "");
    const isCorrect = quizData.answer.trim() === correctAnswer.trim();
    const year = new Date(Date.now() + 5 * 60 * 60 * 1000).getUTCFullYear();

    const idCardMatches = await db
      .collection(COLLECTIONS.quizAnswers)
      .where("idCardNumber", "==", quizData.idCardNumber)
      .where("year", "==", year)
      .where("submissionDate", ">=", formattedStart)
      .where("submissionDate", "<=", formattedEnd)
      .limit(1)
      .get();

    if (!idCardMatches.empty) {
      return {
        success: false,
        message:
          "A submission already exists for today's quiz with matching details. Please try again tomorrow.",
      };
    }

    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.quizAnswers).doc();
    await ref.set(
      toFirestoreData({
        fullName: quizData.fullName,
        contactNumber: quizData.contactNumber,
        idCardNumber: quizData.idCardNumber,
        answer: quizData.answer,
        submissionDate: todayStart.toISOString(),
        questionNumber: quizQuestion.questionNumber,
        correct: isCorrect,
        year,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to submit quiz form:", error);
    throw error;
  }
};

export const getAllQuizSubmissions = async (
  limit: number,
  offset: number,
  selectedDate?: string,
  selectedYear?: number
) => {
  try {
    if (selectedDate) {
      const startDate = new Date(selectedDate);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setUTCHours(23, 59, 59, 999);

      let query: FirebaseFirestore.Query = getFirestoreDb().collection(
        COLLECTIONS.quizAnswers
      );

      if (selectedYear != null) {
        query = query.where("year", "==", selectedYear);
      }

      const snapshot = await query.get();
      const documents = snapshot.docs
        .map((doc) => fromFirestoreDoc(doc))
        .filter((doc: any) => {
          const submissionDate = String(doc.submissionDate || "");
          return (
            submissionDate >= startDate.toISOString() &&
            submissionDate <= endDate.toISOString()
          );
        })
        .sort((a: any, b: any) => {
          const aDate = String(a.submissionDate || a.createdAt || "");
          const bDate = String(b.submissionDate || b.createdAt || "");
          return bDate.localeCompare(aDate);
        });

      return parseStringify({
        documents: documents.slice(offset, offset + limit),
        total: documents.length,
      });
    }

    let baseQuery: FirebaseFirestore.Query = getFirestoreDb().collection(
      COLLECTIONS.quizAnswers
    );

    if (selectedYear != null) {
      baseQuery = baseQuery.where("year", "==", selectedYear);
    }

    baseQuery = baseQuery.orderBy("createdAt", "desc");
    const result = await getPagedDocuments({
      baseQuery,
      pagedQuery: baseQuery.limit(limit).offset(offset),
    });

    return parseStringify(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch quiz submissions:", message);
    throw new Error("Failed to fetch quiz submissions");
  }
};

export const getQuizStatistics = async (
  year?: number | null
): Promise<QuizStatistics> => {
  try {
    const db = getFirestoreDb();
    const questionsSnapshot = await db
      .collection(COLLECTIONS.quizQuestions)
      .limit(5000)
      .get();

    if (questionsSnapshot.empty) {
      throw new Error("No quiz questions found.");
    }

    let submissionsQuery: FirebaseFirestore.Query = db
      .collection(COLLECTIONS.quizAnswers)
      .limit(5000);
    if (year != null) {
      submissionsQuery = db
        .collection(COLLECTIONS.quizAnswers)
        .where("year", "==", year)
        .limit(5000);
    }

    const submissions = await submissionsQuery.get();

    if (submissions.empty) {
      return {
        dailyStats: {},
        topUsers: [],
        topCorrect: [],
        topIncorrect: [],
      };
    }

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

    submissions.docs.forEach((submissionDoc) => {
      const submission = submissionDoc.data();
      const questionNumber = String(submission.questionNumber || "").trim();
      const idCardNumber = String(submission.idCardNumber || "");
      const fullName = String(submission.fullName || "");

      if (!dailyStats[questionNumber]) {
        dailyStats[questionNumber] = { total: 0, correct: 0, incorrect: 0 };
      }

      dailyStats[questionNumber].total += 1;

      if (submission.correct) {
        dailyStats[questionNumber].correct += 1;
        if (!userCorrectCount[idCardNumber]) {
          userCorrectCount[idCardNumber] = { fullName, count: 0 };
        }
        userCorrectCount[idCardNumber].count += 1;
      } else {
        dailyStats[questionNumber].incorrect += 1;
        if (!userIncorrectCount[idCardNumber]) {
          userIncorrectCount[idCardNumber] = { fullName, count: 0 };
        }
        userIncorrectCount[idCardNumber].count += 1;
      }
    });

    const currentDayCount = Math.max(
      0,
      ...Object.keys(dailyStats).map((question) => parseInt(question, 10) || 0)
    );

    const topCorrect: TopUser[] = Object.entries(userCorrectCount)
      .map(([idCardNumber, data]) => ({
        idCardNumber,
        name: data.fullName,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count);

    const highestCount =
      topCorrect.find((user) => user.count <= currentDayCount)?.count ||
      topCorrect[0]?.count ||
      0;

    const filteredTopCorrect = topCorrect.filter(
      (user) => user.count === highestCount
    );

    const topIncorrect: TopUser[] = Object.entries(userIncorrectCount)
      .map(([idCardNumber, data]) => ({
        idCardNumber,
        name: data.fullName,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      dailyStats,
      topUsers: filteredTopCorrect,
      topCorrect: filteredTopCorrect,
      topIncorrect,
    };
  } catch (error) {
    console.error("Failed to fetch quiz statistics:", error);
    throw new Error("Failed to fetch quiz statistics");
  }
};

export const uploadQuizQuestions = async (questions: QuizQuestion[]) => {
  try {
    const db = getFirestoreDb();
    const batch = db.batch();
    const timestamp = nowIso();

    for (const question of questions) {
      if (!Array.isArray(question.options)) {
        throw new Error(
          `Invalid options format for question: ${question.question}`
        );
      }

      const ref = db.collection(COLLECTIONS.quizQuestions).doc();
      batch.set(
        ref,
        toFirestoreData({
          questionNumber: question.questionNumber,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          date: question.date,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      );
    }

    await batch.commit();

    return { success: true, message: "Quiz questions uploaded successfully!" };
  } catch (error) {
    console.error("Failed to upload quiz questions:", error);
    throw new Error("Failed to upload quiz questions.");
  }
};

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

export const getQuizSubmissionsById = async (
  idCardNumber: string | string[] | undefined,
  year?: number
) => {
  try {
    const selectedYear = year ?? QUIZ_COMPETITION_DEFAULT_YEAR;

    if (!idCardNumber || Array.isArray(idCardNumber)) {
      throw new Error("Invalid ID card number provided.");
    }

    const submissionResult = await getFirestoreDb()
      .collection(COLLECTIONS.quizAnswers)
      .where("idCardNumber", "==", idCardNumber)
      .where("year", "==", selectedYear)
      .limit(50)
      .get();

    if (submissionResult.empty) {
      throw new Error("No submissions found.");
    }

    const submissions = submissionResult.docs.map((doc) => fromFirestoreDoc(doc));
    const questionNumbers = Array.from(
      new Set(submissions.map((submission: any) => submission.questionNumber))
    ).filter(Boolean);

    if (questionNumbers.length === 0) {
      throw new Error("No questions found for submissions.");
    }

    const questionMap: Record<string, string> = {};
    for (const group of chunk(questionNumbers, 30)) {
      const questionResult = await getFirestoreDb()
        .collection(COLLECTIONS.quizQuestions)
        .where("questionNumber", "in", group)
        .limit(50)
        .get();
      questionResult.docs.forEach((doc) => {
        const question = doc.data();
        questionMap[String(question.questionNumber)] = String(
          question.question || ""
        );
      });
    }

    const detailedSubmissions = submissions.map((submission: any) => ({
      ...submission,
      questionText:
        questionMap[submission.questionNumber] || "ސުވާލު ނުފެނުނު",
    }));

    return parseStringify(detailedSubmissions);
  } catch (error) {
    console.error("Failed to fetch quiz submissions:", error);
    throw new Error("Failed to fetch quiz submissions.");
  }
};

export const getParticipantDetailsByIdCard = async (idCardNumber: string) => {
  try {
    const normalized = idCardNumber.trim().toUpperCase();
    if (!normalized || normalized.length < 5) return null;

    const quizResult = await getFirestoreDb()
      .collection(COLLECTIONS.quizAnswers)
      .where("idCardNumber", "==", normalized)
      .limit(1)
      .get();
    if (!quizResult.empty) {
      const doc = quizResult.docs[0].data();
      return {
        fullName: doc.fullName ?? "",
        contactNumber: doc.contactNumber ?? "",
      };
    }

    const quran = await getQuranParticipantByIdCard(normalized);
    if (quran) {
      const doc = quran as any;
      return {
        fullName: doc.fullName ?? "",
        contactNumber: doc.contactNumber ?? "",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch participant details:", error);
    return null;
  }
};

const QUIZ_COUNTDOWN_CONFIG_DOC_ID = "quiz-countdown-config";

export const getQuizCountdownSettings = async (): Promise<{
  countdownEnabled: boolean;
  countdownTargetAt: string | null;
}> => {
  try {
    const doc = await getFirestoreDb()
      .collection(COLLECTIONS.quizCountdownSettings)
      .doc(QUIZ_COUNTDOWN_CONFIG_DOC_ID)
      .get();
    const data = doc.data();
    return {
      countdownEnabled: Boolean(data?.countdownEnabled),
      countdownTargetAt: (data?.countdownTargetAt as string | null) ?? null,
    };
  } catch {
    return { countdownEnabled: false, countdownTargetAt: null };
  }
};

export const updateQuizCountdownSettings = async (settings: {
  countdownEnabled: boolean;
  countdownTargetAt: string | null;
}) => {
  try {
    const ref = getFirestoreDb()
      .collection(COLLECTIONS.quizCountdownSettings)
      .doc(QUIZ_COUNTDOWN_CONFIG_DOC_ID);
    const snapshot = await ref.get();
    const timestamp = nowIso();

    await ref.set(
      toFirestoreData({
        countdownEnabled: settings.countdownEnabled,
        countdownTargetAt: settings.countdownTargetAt,
        createdAt: snapshot.exists ? snapshot.data()?.createdAt : timestamp,
        updatedAt: timestamp,
      }),
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to update quiz countdown settings:", error);
  }
};
