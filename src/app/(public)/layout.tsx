import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { env } from "@/config/env";
import {
  buildFooterNavigationFromPages,
  buildHeaderNavigationFromPages,
  resolveContactNavHref,
} from "@/config/navigation";
import { resolveSiteConfig } from "@/config/sites";
import { getPublicPages } from "@/features/home/services/home.queries";
import {
  getServices,
  getServiceTypes,
} from "@/features/services/services/services.queries";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";
import type { ReactNode } from "react";

export const instant = false;

interface PublicLayoutProps {
  children: ReactNode;
}

export default async function PublicLayout({
  children,
}: PublicLayoutProps): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);

  const [settings, publicPages, serviceTypes, services] = await Promise.all([
    getSiteSettings(siteKey),
    Promise.allSettled([getPublicPages(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getServiceTypes(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getServices(undefined, siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
  ]);

  const headerNavItems = buildHeaderNavigationFromPages(
    publicPages,
    config.modules
  );
  const footerNavItems = buildFooterNavigationFromPages(
    publicPages,
    config.modules
  );
  const contactHref = resolveContactNavHref(publicPages);

  const waNumber = settings.contact?.whatsapp ?? settings.contact?.phone;
  const siteName = settings.general?.site_title ?? config.name;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteNavbar
        config={config}
        settings={settings}
        navItems={headerNavItems}
        contactHref={contactHref}
        serviceTypes={serviceTypes}
        services={services}
      />
      <main className="flex-1">{children}</main>
      <WhatsappFab whatsappNumber={waNumber} siteName={siteName} />
      <SiteFooter
        config={config}
        settings={settings}
        navItems={footerNavItems}
      />
    </div>
  );
}
