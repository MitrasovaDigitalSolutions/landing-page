import { Globe } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import type { SiteSocialSettings } from "@/types/site-settings.types";

interface FooterBrandProps {
  siteTitle: string;
  tagline?: string;
  logoUrl?: string;
  logoPath?: string;
  badanHukum?: string;
  social?: SiteSocialSettings;
}

function getInitials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function FooterBrand({
  siteTitle,
  tagline,
  logoUrl,
  logoPath,
  badanHukum,
  social,
}: FooterBrandProps): React.JSX.Element {
  const initials = getInitials(siteTitle);
  const hasLogo = Boolean(logoUrl ?? logoPath);
  const socialEntries = Object.entries(social ?? {}).filter(
    ([, url]) => typeof url === "string" && url.trim().length > 0
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        {hasLogo ? (
          <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1">
            <SmartImage
              src={logoUrl}
              fallbackPath={logoPath}
              alt={siteTitle}
              fill
              className="object-contain"
              fallbackClassName="bg-primary text-sm font-extrabold text-white"
              fallback={<span>{initials}</span>}
            />
          </div>
        ) : (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
            {initials}
          </div>
        )}

        <div>
          <span className="block text-lg font-bold tracking-tight text-slate-900">
            {siteTitle}
          </span>
          {badanHukum ? (
            <span className="text-[11px] font-semibold tracking-wide text-slate-500">
              Badan Hukum: {badanHukum}
            </span>
          ) : (
            <span className="text-[11px] font-semibold tracking-widest text-primary uppercase">
              Lembaga Resmi
            </span>
          )}
        </div>
      </div>

      {tagline ? (
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
          {tagline}
        </p>
      ) : null}

      {socialEntries.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {socialEntries.map(([platform, url]) => (
            <a
              key={platform}
              href={String(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 capitalize transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Globe className="size-3.5 text-primary" />
              <span>{platform}</span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
