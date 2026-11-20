import { httpClient } from "@/lib/http-client";
import type {
  AdminSession,
  AuthUser,
  LoginResponseData,
} from "@/types/auth.types";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connection } from "next/server";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const res = await httpClient.post<LoginResponseData>(
            "/auth/login",
            parsed.data
          );

          if (!res.token) {
            return null;
          }

          const userWithToken: AuthUser = {
            id: String(res.user.id),
            name: res.user.name,
            email: res.user.email,
            is_superadmin: res.user.is_superadmin,
            sites: res.user.sites,
            accessToken: res.token,
          };

          return userWithToken;
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      const authUser = user as AuthUser | undefined;
      if (authUser?.accessToken) {
        token.accessToken = authUser.accessToken;
        token.isSuperadmin = authUser.is_superadmin;
        token.sites = authUser.sites;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      return {
        ...session,
        accessToken:
          typeof token.accessToken === "string" ? token.accessToken : undefined,
        user: {
          ...session.user,
          isSuperadmin:
            typeof token.isSuperadmin === "boolean"
              ? token.isSuperadmin
              : false,
        },
      };
    },
  },
});

export async function logoutApi(token: string): Promise<void> {
  await httpClient.post("/auth/logout", undefined, { token });
}

export async function getMeApi(token: string): Promise<AuthUser> {
  return httpClient.get<AuthUser>("/auth/me", { token });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  await connection();
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session as unknown as AdminSession;
}
