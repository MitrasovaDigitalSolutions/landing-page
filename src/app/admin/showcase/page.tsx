import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnersTable } from "@/features/partners/components/admin/partners-table";
import { getAdminPartners } from "@/features/partners/services/partners.queries";
import { TestimonialsTable } from "@/features/testimonials/components/admin/testimonials-table";
import { getAdminTestimonials } from "@/features/testimonials/services/testimonials.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminShowcasePage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const [testimonialsResult, partnersResult] = await Promise.allSettled([
    getAdminTestimonials(session.accessToken),
    getAdminPartners(session.accessToken),
  ]);

  const testimonials =
    testimonialsResult.status === "fulfilled" ? testimonialsResult.value : [];
  const partners =
    partnersResult.status === "fulfilled" ? partnersResult.value : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Showcase & Kredibilitas"
        description="Kelola ulasan testimoni kepuasan klien dan deretan logo partner terpercaya."
      />

      <Tabs defaultValue="testimonials" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="testimonials" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Testimoni ({testimonials.length})
          </TabsTrigger>
          <TabsTrigger value="partners" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Logo Partner ({partners.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials">
          <TestimonialsTable testimonials={testimonials} />
        </TabsContent>

        <TabsContent value="partners">
          <PartnersTable partners={partners} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
