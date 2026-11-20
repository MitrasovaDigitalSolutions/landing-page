import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PagesTable } from "@/features/home/components/admin/pages-table";
import { getAdminPages } from "@/features/home/services/pages.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import * as React from "react";

export const instant = false;

export default async function AdminPagesPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const pages = await getAdminPages(session.accessToken).catch(() => []);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Manajemen Halaman"
        description="Kelola seluruh halaman situs dari endpoint, metadata SEO, status publikasi, serta susunan section pada setiap halaman."
      />
      <PagesTable initialData={pages} />
    </div>
  );
}
