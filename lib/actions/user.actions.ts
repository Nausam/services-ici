"use server";

import { getCurrentUserProfile } from "@/lib/auth/currentUser";
import { parseStringify } from "@/lib/utils";

export const getCurrentUser = async () => {
  try {
    const user = await getCurrentUserProfile();
    return user ? parseStringify(user) : null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const createAccount = async () => {
  throw new Error("Account creation is handled by Clerk.");
};

export const signInUser = async () => {
  throw new Error("Sign in is handled by Clerk.");
};

export const signOutUser = async () => {
  return { success: true };
};

export const sendEmailOTP = async () => {
  throw new Error("Email OTP is handled by Clerk.");
};

export const verifySecret = async () => {
  throw new Error("Email OTP verification is handled by Clerk.");
};
