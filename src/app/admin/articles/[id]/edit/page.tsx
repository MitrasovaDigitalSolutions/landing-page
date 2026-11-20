import { notFound, redirect } from "next/navigation";
import { ArticleEditorForm } from "@/features/articles/components/admin/article-editor-form";
import {
  getAdminArticleCategories,
  getAdminArticleDetail,
} from "@/features/articles/services/articles.queries";
import { getAdminSession } from "@/lib/auth";

export const instant = false;

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const { id } = await params;
  const articleId = Number.parseInt(id, 10);
  if (Number.isNaN(articleId) || articleId <= 0) {
    notFound();
  }

  const [article, categories] = await Promise.all([
    getAdminArticleDetail(articleId, session.accessToken).catch(() => null),
    getAdminArticleCategories(session.accessToken).catch(() => []),
  ]);

  if (!article) {
    notFound();
  }

  return <ArticleEditorForm article={article} categories={categories} />;
}
