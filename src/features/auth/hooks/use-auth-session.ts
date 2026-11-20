"use client";

import { useSession } from "next-auth/react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export interface UseAuthSessionReturn {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuthSession(): UseAuthSessionReturn {
  const { data: session, status } = useSession();

  const user: CurrentUser | null = session?.user
    ? {
        id: "id" in session.user && typeof session.user.id === "string" ? session.user.id : "",
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      }
    : null;

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
