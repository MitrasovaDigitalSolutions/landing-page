import Link from "next/link";
import { Container } from "@/components/layout/container";
import { FooterBrand } from "@/components/layout/footer-brand";
import { FooterContact } from "@/components/layout/footer-contact";
import { FooterCopyright } from "@/components/layout/footer-copyright";
import type { NavItem } from "@/config/navigation";
import type { SiteConfig } from "@/types/site.types";
import type { SiteSettings } from "@/types/site-settings.types";

interface SiteFooterProps {
  config: SiteConfig;
  settings: SiteSettings;
  navItems: NavItem[];
}

export function SiteFooter({
  config,
  settings,
  navItems,
}: SiteFooterProps): React.JSX.Element {
  const siteTitle = settings.general?.site_title ?? config.name;
  const tagline = settings.general?.tagline ?? "";

  return (
    <footer className="border-t border-slate-200 bg-[#F7F9F7] pt-10 pb-8 text-slate-600">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <FooterBrand
              siteTitle={siteTitle}
              tagline={tagline}
              logoUrl={settings.general?.logo_url}
              logoPath={settings.general?.logo_path}
              badanHukum={settings.legal?.badan_hukum}
              social={settings.social}
            />
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Navigasi Utama
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Kantor & Layanan
            </h4>
            <div className="mt-4">
              <FooterContact contact={settings.contact} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <FooterCopyright
            siteTitle={siteTitle}
            copyright={settings.legal?.copyright}
          />
          {tagline ? (
            <span className="font-medium text-slate-400">{tagline}</span>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
