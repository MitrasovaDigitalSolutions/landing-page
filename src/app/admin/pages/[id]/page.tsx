import { notFound, redirect } from "next/navigation";
import { PageSectionsManager } from "@/features/home/components/admin/page-sections-manager";
import { getAdminPageDetail } from "@/features/home/services/pages.queries";
import { getAdminSession } from "@/lib/auth";

export const instant = false;

interface AdminPageDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPageDetailPage({
  params,
}: AdminPageDetailProps): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const { id } = await params;
  const pageId = Number(id);
  if (!Number.isInteger(pageId) || pageId <= 0) {
    notFound();
  }

  const page = await getAdminPageDetail(pageId, session.accessToken).catch(
    () => null
  );
  if (!page) {
    notFound();
  }

  return <PageSectionsManager page={page} />;
}
