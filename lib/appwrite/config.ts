export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  secretKey: process.env.NEXT_APPWRITE_KEY!,

  quranCompetitionBucket: process.env.NEXT_PUBLIC_APPWRITE_QURAN_ID_BUCKET!,
  homeCardsImageBucket:
    process.env.NEXT_PUBLIC_APPWRITE_HOME_CARDS_IMAGE_BUCKET!,
  wasteManagementBucket: process.env.NEXT_PUBLIC_APPWRITE_WASTE_ID_BUCKET!,

  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  wasteManagementFormsId:
    process.env.NEXT_PUBLIC_APPWRITE_WASTE_MANAGEMENT_COLLECTION!,
  quranCompetitionId:
    process.env.NEXT_PUBLIC_APPWRITE_QURAN_COMPETITION_COLLECTION!,
  quizCompetitionId: process.env.NEXT_PUBLIC_APPWRITE_QUIZ_COLLECTION!,
  quizCompetitionAnswersId:
    process.env.NEXT_PUBLIC_APPWRITE_QUIZ_ANSWERS_COLLECTION!,
  homeCardsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_HOME_CARDS_COLLECTION!,
  madhahaCompetitionId:
    process.env.NEXT_PUBLIC_APPWRITE_MADHAHA_COMPETITION_COLLECTION!,
  permissionRequestsId:
    process.env.NEXT_PUBLIC_APPWRITE_PERMISSION_REQUESTS_COLLECTION!,
};
