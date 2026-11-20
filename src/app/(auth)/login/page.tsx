import { Container } from "@/components/layout/container";
import { LoginForm } from "@/features/auth/components/login-form";
import { getAdminSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const instant = false;

export const metadata: Metadata = {
  title: "Portal Administrasi",
  description: "Akses manajemen konten dan operasional unit bisnis Mitrasova",
};

export default async function LoginPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (session?.accessToken) {
    redirect("/admin");
  }

  return (
    <Container size="narrow" className="flex items-center justify-center">
      <LoginForm />
    </Container>
  );
}
