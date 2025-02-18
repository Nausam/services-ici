"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", email)]
  );

  return result.total > 0 ? result.documents[0] : null;
};

// **Create a New User Account with Email & Password**
export const createAccount = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const { account, databases } = await createAdminClient();

  try {
    // Create a new Appwrite user account
    const user = await account.create(ID.unique(), email, password, fullName);

    // Store user details in the database
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        accountId: user.$id,
      }
    );

    return parseStringify({ userId: user.$id });
  } catch (error) {
    throw new Error("Failed to create account. ");
  }
};

// **Sign In User with Email & Password**
export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { account } = await createAdminClient();

  try {
    // Create a session for the user
    const session = await account.createEmailPasswordSession(email, password);

    // Set the session in cookies
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    throw new Error("Invalid email or password. ");
  }
};

// **Get Current User Session**
export const getCurrentUser = async () => {
  try {
    const { account, databases } = await createSessionClient();

    // Get the logged-in user details
    const result = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) {
      return null;
    }

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// **Sign Out User**
export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    throw new Error("Failed to sign out user. ");
  } finally {
    // redirect("/sign-in");
  }
};
