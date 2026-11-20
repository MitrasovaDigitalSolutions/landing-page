import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceTypesTable } from "@/features/services/components/admin/service-types-table";
import { ServicesTable } from "@/features/services/components/admin/services-table";
import {
  getAdminServices,
  getAdminServiceTypes,
} from "@/features/services/services/services.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminServicesPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const [typesResult, servicesResult] = await Promise.allSettled([
    getAdminServiceTypes(session.accessToken),
    getAdminServices(session.accessToken),
  ]);

  const types = typesResult.status === "fulfilled" ? typesResult.value : [];
  const services =
    servicesResult.status === "fulfilled" ? servicesResult.value : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Layanan & Produk"
        description="Kelola katalog produk, tipe layanan, dan fitur unggulan unit usaha Anda."
      />

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="services" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Daftar Layanan ({services.length})
          </TabsTrigger>
          <TabsTrigger value="types" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Tipe Layanan ({types.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServicesTable services={services} types={types} />
        </TabsContent>

        <TabsContent value="types">
          <ServiceTypesTable types={types} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
