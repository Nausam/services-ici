import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export const COLLECTION_EXPORTS = [
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_USERS_COLLECTION",
    target: "users",
    file: "users.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_WASTE_MANAGEMENT_COLLECTION",
    target: "wasteManagementForms",
    file: "wasteManagementForms.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_QURAN_COMPETITION_COLLECTION",
    target: "quranCompetitionRegistrations",
    file: "quranCompetitionRegistrations.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_QUIZ_COLLECTION",
    target: "quizQuestions",
    file: "quizQuestions.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_QUIZ_ANSWERS_COLLECTION",
    target: "quizAnswers",
    file: "quizAnswers.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_QUIZ_COUNTDOWN_SETTINGS_COLLECTION",
    target: "quizCountdownSettings",
    file: "quizCountdownSettings.json",
    optional: true,
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_HOME_CARDS_COLLECTION",
    target: "homeCards",
    file: "homeCards.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_MADHAHA_COMPETITION_COLLECTION",
    target: "madhahaCompetitionRegistrations",
    file: "madhahaCompetitionRegistrations.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_HUTHUBA_BANGI_COMPETITION_COLLECTION",
    target: "huthubaBangiCompetitionRegistrations",
    file: "huthubaBangiCompetitionRegistrations.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_PERMISSION_REQUESTS_COLLECTION",
    target: "permissionRequests",
    file: "permissionRequests.json",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_COUNCIL_AWARD_COLLECTION",
    target: "councilAwardRegistrations",
    file: "councilAwardRegistrations.json",
  },
] as const;

export const BUCKET_EXPORTS = [
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_WASTE_ID_BUCKET",
    name: "wasteManagement",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_QURAN_ID_BUCKET",
    name: "quranCompetition",
  },
  {
    sourceEnv: "NEXT_PUBLIC_APPWRITE_HOME_CARDS_IMAGE_BUCKET",
    name: "homeCards",
  },
] as const;

export const FILE_FIELDS = [
  {
    collection: "wasteManagementForms",
    field: "idCard",
    bucketName: "wasteManagement",
    folder: "waste-management/id-cards",
  },
  {
    collection: "quranCompetitionRegistrations",
    field: "idCard",
    bucketName: "quranCompetition",
    folder: "quran-competition/id-cards",
  },
  {
    collection: "madhahaCompetitionRegistrations",
    field: "idCard",
    bucketName: "quranCompetition",
    folder: "madhaha/id-cards",
  },
  {
    collection: "huthubaBangiCompetitionRegistrations",
    field: "idCard",
    bucketName: "quranCompetition",
    folder: "huthuba-bangi/id-cards",
  },
  {
    collection: "homeCards",
    field: "image",
    idField: "imageId",
    bucketName: "homeCards",
    folder: "home-cards",
  },
] as const;

export const getArtifactDir = () =>
  process.env.MIGRATION_ARTIFACT_DIR ||
  path.join(process.cwd(), "migration-artifacts", "latest");

export const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
};

export const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await fs.readFile(filePath, "utf8")) as T;

export const writeJson = async (filePath: string, value: unknown) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

export const parseAppwriteFileId = (value: unknown) => {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/\/files\/([^/]+)\//);
  return match?.[1] || null;
};

export const parseAppwriteFileRef = (value: unknown) => {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/\/buckets\/([^/]+)\/files\/([^/]+)\//);
  if (!match) return null;
  return {
    bucketId: match[1],
    fileId: match[2],
  };
};

export const safeFileName = (name: string) =>
  name
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "upload";
