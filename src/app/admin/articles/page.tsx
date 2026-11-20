import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCategoriesTable } from "@/features/articles/components/admin/article-categories-table";
import { ArticlesTable } from "@/features/articles/components/admin/articles-table";
import {
  getAdminArticleCategories,
  getAdminArticles,
} from "@/features/articles/services/articles.queries";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminArticlesPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const [articlesResult, categoriesResult] = await Promise.allSettled([
    getAdminArticles(session.accessToken),
    getAdminArticleCategories(session.accessToken),
  ]);

  const articles =
    articlesResult.status === "fulfilled" ? articlesResult.value : [];
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artikel & Berita"
        description="Kelola publikasi informasi, artikel edukasi, dan berita terbaru unit usaha Anda."
      />

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="articles" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Semua Artikel ({articles.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Kategori ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <ArticlesTable articles={articles} categories={categories} />
        </TabsContent>

        <TabsContent value="categories">
          <ArticleCategoriesTable categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
