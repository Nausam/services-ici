import "server-only";

import type {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export const nowIso = () => new Date().toISOString();

export const cleanFirestoreData = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(cleanFirestoreData).filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key, cleanFirestoreData(item)] as const)
      .filter(([, item]) => item !== undefined);

    return Object.fromEntries(entries);
  }

  return value === undefined ? undefined : value;
};

export const toFirestoreData = (value: Record<string, unknown>) =>
  cleanFirestoreData(value) as Record<string, unknown>;

export const fromFirestoreDoc = <T = Record<string, unknown>>(
  doc: QueryDocumentSnapshot<DocumentData> | FirebaseFirestore.DocumentSnapshot
) => {
  const data = (doc.data() ?? {}) as Record<string, unknown>;
  const createdAt = (data.createdAt || data.$createdAt) as string | undefined;
  const updatedAt = (data.updatedAt || data.$updatedAt) as string | undefined;

  return {
    ...data,
    $id: doc.id,
    $createdAt: createdAt,
    $updatedAt: updatedAt,
  } as T & {
    $id: string;
    $createdAt?: string;
    $updatedAt?: string;
  };
};

export const getTotal = async (query: Query<DocumentData>) => {
  const snapshot = await query.get();
  return snapshot.size;
};

export const getPagedDocuments = async <T = Record<string, unknown>>({
  baseQuery,
  pagedQuery,
}: {
  baseQuery: Query<DocumentData>;
  pagedQuery: Query<DocumentData>;
}) => {
  const [total, snapshot] = await Promise.all([
    getTotal(baseQuery),
    pagedQuery.get(),
  ]);

  return {
    documents: snapshot.docs.map((doc) => fromFirestoreDoc<T>(doc)),
    total,
  };
};
