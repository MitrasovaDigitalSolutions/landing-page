import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PortfoliosTable } from "@/features/portfolio/components/admin/portfolios-table";
import { getAdminPortfolios } from "@/features/portfolio/services/portfolio.queries";
import { getAdminServiceTypes } from "@/features/services/services/services.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminPortfoliosPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const [portfoliosResult, typesResult] = await Promise.allSettled([
    getAdminPortfolios(session.accessToken),
    getAdminServiceTypes(session.accessToken),
  ]);

  const portfolios =
    portfoliosResult.status === "fulfilled" ? portfoliosResult.value : [];
  const types = typesResult.status === "fulfilled" ? typesResult.value : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Portofolio Karya"
        description="Pamerkan hasil kerja, proyek klien, dan galeri bukti nyata kualitas produk unit usaha Anda."
      />
      <PortfoliosTable portfolios={portfolios} types={types} />
    </div>
  );
}
