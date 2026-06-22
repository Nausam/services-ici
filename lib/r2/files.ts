import "server-only";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getR2BucketName, getR2Client, getR2PublicBaseUrl } from "./client";

export type UploadFolder =
  | "waste-management/id-cards"
  | "quran-competition/id-cards"
  | "madhaha/id-cards"
  | "huthuba-bangi/id-cards"
  | "home-cards";

const safeFileName = (name: string) =>
  name
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "upload";

export const constructR2PublicUrl = (key: string) =>
  `${getR2PublicBaseUrl()}/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

export const uploadFileToR2 = async (file: File, folder: UploadFolder) => {
  const id = randomUUID();
  const key = `${folder}/${id}-${safeFileName(file.name)}`;
  const body = Buffer.from(await file.arrayBuffer());

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
      ContentLength: body.length,
    })
  );

  return {
    key,
    url: constructR2PublicUrl(key),
    size: body.length,
  };
};

export const deleteFileFromR2 = async (key?: string | null) => {
  if (!key) return;

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    })
  );
};
