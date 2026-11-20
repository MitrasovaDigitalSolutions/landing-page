import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Scrollable } from "@/components/ui/scrollable";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/services/api/settings.service";
import { generateBrandCssVariables } from "@/utils/color";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const instant = false;

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const settings = await getSiteSettings(siteKey);
  const siteName = settings.general?.site_title ?? config.name;
  const brandVars = generateBrandCssVariables(
    settings.general?.brand_color ?? config.defaultBrandColor
  );

  return (
    <div
      style={brandVars}
      className="flex h-dvh w-full overflow-hidden bg-slate-100 font-sans text-slate-900"
    >
      <AdminSidebar isSuperadmin={session.user.isSuperadmin} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader session={session} siteName={siteName} />
        <Scrollable className="min-h-0 flex-1">
          <main className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
            {children}
          </main>
        </Scrollable>
      </div>
    </div>
  );
}
