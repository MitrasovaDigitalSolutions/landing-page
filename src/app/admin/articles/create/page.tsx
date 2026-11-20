import { redirect } from "next/navigation";
import { ArticleEditorForm } from "@/features/articles/components/admin/article-editor-form";
import { getAdminArticleCategories } from "@/features/articles/services/articles.queries";
import { getAdminSession } from "@/lib/auth";

export const instant = false;

export default async function CreateArticlePage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const categories = await getAdminArticleCategories(
    session.accessToken
  ).catch(() => []);

  return <ArticleEditorForm article={null} categories={categories} />;
}
