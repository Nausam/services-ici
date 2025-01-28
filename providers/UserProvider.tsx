"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";

const UserContext = createContext({
  currentUser: null,
  isAdmin: false,
  loading: true,
  refreshUser: async () => {}, // Function to refresh user data
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);

      // ✅ Check for `isAdmin` boolean field instead of labels
      setIsAdmin(user?.isAdmin || false);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUser, isAdmin, loading, refreshUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
