import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { Scrollable } from "@/components/ui/scrollable";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { DashboardStatsCard } from "@/features/admin/components/dashboard-stats-card";
import { RecentInquiryRow } from "@/features/admin/components/recent-inquiry-row";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/services/api/settings.service";
import { getAdminStatistics } from "@/services/api/statistics.service";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Inbox,
  Layers,
  Settings,
  Star,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [stats, settings] = await Promise.all([
    getAdminStatistics(session.accessToken, siteKey),
    getSiteSettings(siteKey),
  ]);
  const siteTitle = settings.general?.site_title ?? config.name;

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Dashboard Operasional"
        description={`Ringkasan katalog, publikasi, dan konsultasi masuk — ${siteTitle}.`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/settings"
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
            >
              <Settings className="size-3.5 text-primary" />
              <span>Pengaturan Situs</span>
            </Link>
            <Link
              href="/admin/pages"
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-2xs transition-opacity hover:opacity-95"
            >
              <Layers className="size-3.5" />
              <span>Section Beranda</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          <DashboardStatsCard
            label="Katalog & Portofolio"
            value={`${stats.services_count} Layanan`}
            sublabel={`${stats.featured_services_count} unggulan • ${stats.portfolios_count} portofolio`}
            icon={Briefcase}
            href="/admin/services"
          />
          <DashboardStatsCard
            label="Publikasi & Edukasi"
            value={`${stats.articles_count} Artikel`}
            sublabel={`${stats.published_articles_count} terbit • ${stats.faqs_count} daftar FAQ`}
            icon={FileText}
            href="/admin/articles"
          />
          <DashboardStatsCard
            label="Kredibilitas & Kemitraan"
            value={`${stats.testimonials_count + stats.partners_count} Entri`}
            sublabel={`${stats.testimonials_count} testimoni • ${stats.partners_count} partner`}
            icon={Star}
            href="/admin/showcase"
          />
        </div>

        <Card className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Inbox className="size-4 text-primary" />
              <span className="text-xs font-bold text-slate-900">
                Kotak Masuk & Konsultasi ({stats.inquiries_count})
              </span>
              {stats.unread_inquiries_count > 0 ? (
                <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                  {stats.unread_inquiries_count} Baru
                </span>
              ) : null}
            </div>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Kelola Semua</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {stats.recent_inquiries.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-xs text-slate-400">
              Belum ada pesan konsultasi masuk.
            </div>
          ) : (
            <Scrollable className="max-h-72 flex-1">
              <div className="divide-y divide-slate-100">
                {stats.recent_inquiries.map((inq) => (
                  <RecentInquiryRow key={inq.id} inquiry={inq} />
                ))}
              </div>
            </Scrollable>
          )}
        </Card>
      </div>
    </div>
  );
}
