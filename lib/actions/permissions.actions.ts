"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
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
    const { databases } = await createAdminClient();

    // Query to check if the same request already exists
    const existingRequest = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.permissionRequestsId,
      [
        Query.equal("fullName", requestData.fullName),
        Query.equal("contactNumber", requestData.contactNumber),
        Query.equal("permissionType", requestData.permissionType),
        Query.greaterThanEqual("startDate", requestData.startDate),
        Query.lessThanEqual("endDate", requestData.endDate),
      ]
    );

    if (existingRequest.total > 0) {
      return {
        success: false,
        message: "A similar permission request already exists.",
      };
    }

    // Create a new permission request document
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.permissionRequestsId,
      ID.unique(),
      {
        fullName: requestData.fullName,
        contactNumber: requestData.contactNumber,
        company: requestData.company || "",
        permissionType: requestData.permissionType,
        reason: requestData.reason,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        requestDate: new Date().toISOString(), // Store request timestamp
      }
    );

    return response;
  } catch (error) {
    console.error("❌ Failed to submit permission request:", error);
    throw new Error("Failed to submit permission request");
  }
};

// GET ALL PERMISSION REQUESTS
export const getAllPermissionRequests = async (
  limit: number,
  offset: number
) => {
  try {
    const { databases } = await createAdminClient();

    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.permissionRequestsId,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"), // Latest first
      ]
    );

    return {
      documents: parseStringify(requests.documents),
      total: requests.total,
    };
  } catch (error) {
    console.error("❌ Failed to fetch permission requests:", error);
    throw new Error("Failed to fetch permission requests");
  }
};

export const getPermissionRequestById = async (id: string) => {
  try {
    const { databases } = await createAdminClient();

    const request = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.permissionRequestsId,
      id
    );

    return request;
  } catch (error) {
    console.error("❌ Failed to fetch permission request:", error);
    return null;
  }
};
