import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { env } from "@/config/env";
import { PublicBranchesGrid } from "@/features/branches/components/public-branches-grid";
import { getBranches } from "@/features/branches/services/branches.queries";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const page = await getPageBySlug("cabang", siteKey).catch(() => null);

  return {
    title: page?.meta_title ?? page?.title ?? "Cabang Kami",
    description: page?.meta_desc ?? undefined,
  };
}

export default async function CabangPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, branches] = await Promise.all([
    Promise.allSettled([getPageBySlug("cabang", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    Promise.allSettled([getBranches(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
  ]);

  const heroSection = (page?.sections ?? []).find((s) => s.key === "hero");
  const stats = heroSection?.payload?.stats ?? [];

  return (
    <div className="flex flex-col">
      <PageHero
        badge="Jaringan Layanan"
        title={heroSection?.title ?? page?.title ?? "Cabang Kami"}
        description={heroSection?.body ?? page?.meta_desc}
        stats={stats}
      />
      <PublicBranchesGrid branches={branches} />
    </div>
  );
}
