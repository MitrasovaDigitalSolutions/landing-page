"use server";

import { getAdminSession, logoutApi } from "@/lib/auth";

export async function revokeAdminTokenAction(): Promise<void> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return;
  }

  try {
    await logoutApi(session.accessToken);
  } catch {
    // Ignore revoke errors during client signOut
  }
}
