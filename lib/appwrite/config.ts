export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  wasteManagementFormsId:
    process.env.NEXT_PUBLIC_APPWRITE_WASTE_MANAGEMENT_COLLECTION!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,
  quranCompetitionBucket: process.env.NEXT_PUBLIC_APPWRITE_QURAN_ID_BUCKET!,
  quranCompetitionId:
    process.env.NEXT_PUBLIC_APPWRITE_QURAN_COMPETITION_COLLECTION!,
  quizCompetitionId: process.env.NEXT_PUBLIC_APPWRITE_QUIZ_COLLECTION!,
  quizCompetitionAnswersId:
    process.env.NEXT_PUBLIC_APPWRITE_QUIZ_ANSWERS_COLLECTION!,
  wasteManagementBucket: process.env.NEXT_PUBLIC_APPWRITE_WASTE_ID_BUCKET!,
};
