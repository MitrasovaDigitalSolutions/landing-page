import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqCategoriesTable } from "@/features/faq/components/admin/faq-categories-table";
import { FaqsTable } from "@/features/faq/components/admin/faqs-table";
import {
  getAdminFaqCategories,
  getAdminFaqs,
} from "@/features/faq/services/faq.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminFaqsPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const [faqsResult, categoriesResult] = await Promise.allSettled([
    getAdminFaqs(session.accessToken),
    getAdminFaqCategories(session.accessToken),
  ]);

  const faqs = faqsResult.status === "fulfilled" ? faqsResult.value : [];
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tanya Jawab (FAQ) & Kategori"
        description="Kelola daftar pertanyaan yang sering diajukan beserta pengelompokan kategorinya."
      />

      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="faqs" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Daftar FAQ ({faqs.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Kategori FAQ ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faqs">
          <FaqsTable faqs={faqs} categories={categories} />
        </TabsContent>

        <TabsContent value="categories">
          <FaqCategoriesTable categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
