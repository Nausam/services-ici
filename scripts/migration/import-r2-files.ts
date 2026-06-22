import fs from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  FILE_FIELDS,
  getArtifactDir,
  parseAppwriteFileRef,
  readJson,
  requireEnv,
  safeFileName,
  writeJson,
} from "./shared";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
});
const bucket = requireEnv("R2_BUCKET_NAME");
const publicBaseUrl = requireEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");

const publicUrl = (key: string) =>
  `${publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;

const loadBucketManifest = async (artifactDir: string, bucketName: string) => {
  const manifest = await readJson<any>(
    path.join(artifactDir, "storage", `${bucketName}.json`)
  );
  return new Map<string, any>(
    manifest.files.map((file: any) => [String(file.$id), file])
  );
};

const findLocalFile = async (
  artifactDir: string,
  bucketName: string,
  fileId: string
) => {
  const dir = path.join(artifactDir, "storage", bucketName);
  const files = await fs.readdir(dir);
  const match = files.find((file) => file.startsWith(`${fileId}-`));
  if (!match) throw new Error(`Missing downloaded file ${bucketName}/${fileId}`);
  return path.join(dir, match);
};

const main = async () => {
  const artifactDir = getArtifactDir();
  const bucketManifests = new Map<string, Map<string, any>>();
  const bucketIdToName = new Map<string, string>();
  const mappings: unknown[] = [];
  const missingFiles: unknown[] = [];

  for (const bucketName of ["wasteManagement", "quranCompetition", "homeCards"]) {
    try {
      const manifest = await readJson<any>(
        path.join(artifactDir, "storage", `${bucketName}.json`)
      );
      bucketIdToName.set(manifest.bucketId, bucketName);
    } catch {
      // Ignore buckets that are not present in a partial export.
    }
  }

  for (const field of FILE_FIELDS) {
    if (!bucketManifests.has(field.bucketName)) {
      bucketManifests.set(
        field.bucketName,
        await loadBucketManifest(artifactDir, field.bucketName)
      );
    }

    const data = await readJson<{ documents: Record<string, any>[] }>(
      path.join(artifactDir, "data", `${field.collection}.json`)
    );

    for (const doc of data.documents) {
      const legacyUrl = doc[field.field];
      const idField = "idField" in field ? field.idField : undefined;
      const legacyFileRef = parseAppwriteFileRef(legacyUrl);
      const legacyFileId = legacyFileRef?.fileId || (idField ? doc[idField] : null);
      if (!legacyFileId) continue;
      const sourceBucketName =
        (legacyFileRef?.bucketId && bucketIdToName.get(legacyFileRef.bucketId)) ||
        field.bucketName;

      if (!bucketManifests.has(sourceBucketName)) {
        bucketManifests.set(
          sourceBucketName,
          await loadBucketManifest(artifactDir, sourceBucketName)
        );
      }

      const manifestFile = bucketManifests
        .get(sourceBucketName)
        ?.get(legacyFileId);
      if (!manifestFile) {
        const missing = {
          collection: field.collection,
          docId: doc.$id,
          field: field.field,
          idField,
          legacyUrl,
          legacyFileId,
          sourceBucketName,
          missing: true,
        };
        mappings.push(missing);
        missingFiles.push(missing);
        continue;
      }

      const filePath = await findLocalFile(
        artifactDir,
        sourceBucketName,
        legacyFileId
      );
      const key = `${field.folder}/${legacyFileId}-${safeFileName(
        manifestFile.name
      )}`;
      const body = await fs.readFile(filePath);

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: manifestFile.mimeType || "application/octet-stream",
        })
      );

      mappings.push({
        collection: field.collection,
        docId: doc.$id,
        field: field.field,
        idField,
        legacyUrl,
        legacyFileId,
        r2Key: key,
        r2Url: publicUrl(key),
      });
    }
  }

  await writeJson(path.join(artifactDir, "file-url-map.json"), mappings);
  await writeJson(path.join(artifactDir, "missing-file-refs.json"), missingFiles);
  console.log(`Uploaded ${mappings.length} referenced files to R2.`);
  if (missingFiles.length > 0) {
    console.warn(`Missing legacy files: ${missingFiles.length}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
