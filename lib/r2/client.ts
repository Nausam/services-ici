import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

export const getR2Client = () => {
  if (client) return client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return client;
};

export const getR2BucketName = () => {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("Missing R2_BUCKET_NAME");
  return bucket;
};

export const getR2PublicBaseUrl = () => {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("Missing R2_PUBLIC_BASE_URL");
  return baseUrl.replace(/\/$/, "");
};
