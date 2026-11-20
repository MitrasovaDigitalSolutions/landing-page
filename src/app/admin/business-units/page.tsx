import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BusinessUnitsTable } from "@/features/business-units/components/admin/business-units-table";
import { getAdminBusinessUnits } from "@/features/business-units/services/business-units.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminBusinessUnitsPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const units = await getAdminBusinessUnits(session.accessToken).catch(() => []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Unit Usaha Grup"
        description="Kelola unit usaha yang bernaung dalam grup beserta foto dan galeri carousel."
      />
      <BusinessUnitsTable units={units} />
    </div>
  );
}
