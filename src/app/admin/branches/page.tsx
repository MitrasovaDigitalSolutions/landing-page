import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BranchesTable } from "@/features/branches/components/admin/branches-table";
import { getAdminBranches } from "@/features/branches/services/branches.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminBranchesPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const branches = await getAdminBranches(session.accessToken).catch(() => []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kantor Pusat & Cabang"
        description="Kelola lokasi kantor pusat dan cabang beserta alamat, kontak, dan foto."
      />
      <BranchesTable branches={branches} />
    </div>
  );
}
