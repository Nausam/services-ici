import fs from "node:fs/promises";
import path from "node:path";
import {
  BUCKET_EXPORTS,
  COLLECTION_EXPORTS,
  getArtifactDir,
  requireEnv,
  safeFileName,
  writeJson,
} from "./shared";

const endpoint = requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT").replace(/\/$/, "");
const projectId = requireEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
const databaseId = requireEnv("NEXT_PUBLIC_APPWRITE_DATABASE");
const apiKey = requireEnv("NEXT_APPWRITE_KEY");
const artifactDir = getArtifactDir();

const appwriteFetch = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "X-Appwrite-Project": projectId,
      "X-Appwrite-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response;
};

const appendQuery = (url: URL, method: string, values: unknown[]) => {
  url.searchParams.append("queries[]", JSON.stringify({ method, values }));
};

const exportCollection = async (collectionId: string) => {
  const documents: unknown[] = [];
  const pageSize = 100;
  let total = 0;

  do {
    const url = new URL(
      `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`
    );
    appendQuery(url, "limit", [pageSize]);
    appendQuery(url, "offset", [documents.length]);
    const payload = await (await appwriteFetch(url.toString())).json();
    total = payload.total;
    documents.push(...payload.documents);
  } while (documents.length < total);

  return { total, documents };
};

const exportBucket = async (bucketId: string, bucketName: string) => {
  const files: any[] = [];
  const pageSize = 100;
  let total = 0;

  do {
    const url = new URL(`${endpoint}/storage/buckets/${bucketId}/files`);
    appendQuery(url, "limit", [pageSize]);
    appendQuery(url, "offset", [files.length]);
    const payload = await (await appwriteFetch(url.toString())).json();
    total = payload.total;
    files.push(...payload.files);
  } while (files.length < total);

  const filesDir = path.join(artifactDir, "storage", bucketName);
  await fs.mkdir(filesDir, { recursive: true });

  for (const file of files) {
    const downloadUrl = `${endpoint}/storage/buckets/${bucketId}/files/${file.$id}/download`;
    const buffer = Buffer.from(await (await appwriteFetch(downloadUrl)).arrayBuffer());
    await fs.writeFile(
      path.join(filesDir, `${file.$id}-${safeFileName(file.name)}`),
      buffer
    );
  }

  return { bucketId, bucketName, total, files };
};

const main = async () => {
  await fs.mkdir(artifactDir, { recursive: true });
  await writeJson(path.join(artifactDir, "manifest.json"), {
    exportedAt: new Date().toISOString(),
    endpoint,
    databaseId,
  });

  for (const collection of COLLECTION_EXPORTS) {
    const collectionId = process.env[collection.sourceEnv];
    if (!collectionId) {
      if ("optional" in collection && collection.optional) continue;
      throw new Error(`Missing ${collection.sourceEnv}`);
    }
    const exportData = await exportCollection(collectionId);
    await writeJson(path.join(artifactDir, "data", collection.file), exportData);
  }

  for (const bucket of BUCKET_EXPORTS) {
    const bucketId = process.env[bucket.sourceEnv];
    if (!bucketId) throw new Error(`Missing ${bucket.sourceEnv}`);
    const exportData = await exportBucket(bucketId, bucket.name);
    await writeJson(
      path.join(artifactDir, "storage", `${bucket.name}.json`),
      exportData
    );
  }

  console.log(`Export complete: ${artifactDir}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
