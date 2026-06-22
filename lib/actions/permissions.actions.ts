"use server";

import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  fromFirestoreDoc,
  getPagedDocuments,
  nowIso,
  toFirestoreData,
} from "@/lib/firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/admin";
import { parseStringify } from "../utils";

export const createPermissionRequest = async (requestData: {
  fullName: string;
  contactNumber: string;
  company?: string;
  permissionType: string;
  reason: string;
  startDate: string;
  endDate: string;
}) => {
  try {
    const db = getFirestoreDb();

    const existingRequest = await db
      .collection(COLLECTIONS.permissionRequests)
      .where("fullName", "==", requestData.fullName)
      .where("contactNumber", "==", requestData.contactNumber)
      .where("permissionType", "==", requestData.permissionType)
      .where("startDate", ">=", requestData.startDate)
      .where("endDate", "<=", requestData.endDate)
      .limit(1)
      .get();

    if (!existingRequest.empty) {
      return {
        success: false,
        message: "A similar permission request already exists.",
      };
    }

    const timestamp = nowIso();
    const ref = db.collection(COLLECTIONS.permissionRequests).doc();
    await ref.set(
      toFirestoreData({
        fullName: requestData.fullName,
        contactNumber: requestData.contactNumber,
        company: requestData.company || "",
        permissionType: requestData.permissionType,
        reason: requestData.reason,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        requestDate: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    return parseStringify(fromFirestoreDoc(await ref.get()));
  } catch (error) {
    console.error("Failed to submit permission request:", error);
    throw new Error("Failed to submit permission request");
  }
};

export const getAllPermissionRequests = async (
  limit: number,
  offset: number
) => {
  try {
    const baseQuery = getFirestoreDb()
      .collection(COLLECTIONS.permissionRequests)
      .orderBy("createdAt", "desc");
    const result = await getPagedDocuments({
      baseQuery,
      pagedQuery: baseQuery.limit(limit).offset(offset),
    });

    return parseStringify(result);
  } catch (error) {
    console.error("Failed to fetch permission requests:", error);
    throw new Error("Failed to fetch permission requests");
  }
};

export const getPermissionRequestById = async (id: string) => {
  try {
    const request = await getFirestoreDb()
      .collection(COLLECTIONS.permissionRequests)
      .doc(id)
      .get();

    return request.exists ? parseStringify(fromFirestoreDoc(request)) : null;
  } catch (error) {
    console.error("Failed to fetch permission request:", error);
    return null;
  }
};
