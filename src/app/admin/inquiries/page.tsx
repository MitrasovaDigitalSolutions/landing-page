import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { InquiriesTable } from "@/features/inquiry/components/admin/inquiries-table";
import { getAdminInquiries } from "@/features/inquiry/services/inquiry.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import * as React from "react";

export const instant = false;

export default async function AdminInquiriesPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const inquiries = await getAdminInquiries(session.accessToken).catch(
    () => []
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kotak Masuk & Konsultasi"
        description="Kelola pesan pertanyaan, konsultasi, dan pengajuan layanan dari calon pelanggan."
      />
      <InquiriesTable initialData={inquiries} />
    </div>
  );
}
