"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";

const UserContext = createContext({
  currentUser: null,
  isAdmin: false,
  isSuperAdmin: false,
  loading: true,
  refreshUser: async () => {}, // Function to refresh user data
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, userId } = useAuth();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Admins have the same access as superadmins throughout the app.
      const role = String(user?.role ?? "").toLowerCase();
      const hasFullAdminAccess =
        Boolean(user?.isAdmin) ||
        Boolean(user?.isSuperAdmin) ||
        role === "admin" ||
        role === "superadmin";

      setIsAdmin(hasFullAdminAccess);
      setIsSuperAdmin(hasFullAdminAccess);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setCurrentUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      setCurrentUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setLoading(false);
      return;
    }

    void fetchUser();
  }, [fetchUser, isLoaded, userId]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAdmin,
        isSuperAdmin,
        loading,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
