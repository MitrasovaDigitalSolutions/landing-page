import {
  ArrowUpRight,
  Camera,
  Globe,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  buildPartnerTelHref,
  buildPartnerWhatsappMessage,
  buildPartnerWhatsappUrl,
  formatPartnerWebsiteLabel,
  isInstagramUrl,
} from "@/features/partners/utils/partner-contact";
import type { Partner } from "@/types/api.types";

interface PartnerContactCardsProps {
  partner: Partner;
  siteName: string;
  siteUrl: string;
}

export function PartnerContactCards({
  partner,
  siteName,
  siteUrl,
}: PartnerContactCardsProps): React.JSX.Element {
  const websiteUrl = partner.website_url?.trim() ?? "";
  const isInstagram = isInstagramUrl(websiteUrl);
  const waUrl = buildPartnerWhatsappUrl(
    partner.phone,
    partner.name,
    siteName,
    siteUrl
  );
  const waMessage = buildPartnerWhatsappMessage(
    partner.name,
    siteName,
    siteUrl
  );
  const telHref = buildPartnerTelHref(partner.phone);

  if (!websiteUrl && !waUrl && !telHref) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-600">
        {partner.name} merupakan mitra strategis terverifikasi bersama {siteName}.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {websiteUrl ? (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6">
          <div>
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isInstagram ? (
                <Camera className="size-5" />
              ) : (
                <Globe className="size-5" />
              )}
            </span>
            <h2 className="mt-4 text-base font-bold text-slate-900">
              {isInstagram ? "Instagram Mitra" : "Website Resmi Mitra"}
            </h2>
            <p className="mt-1 truncate text-xs font-medium text-slate-500">
              {formatPartnerWebsiteLabel(websiteUrl)}
            </p>
          </div>

          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span>{isInstagram ? "Buka Instagram" : "Kunjungi Website"}</span>
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      ) : null}

      {waUrl ? (
        <div className="flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6">
          <div>
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
              <MessageCircle className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-bold text-slate-900">
              WhatsApp Mitra
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-700 tabular-nums">
              {partner.phone}
            </p>
            <p className="mt-3 rounded-xl border border-emerald-200/70 bg-white/90 p-3 text-[11px] leading-relaxed text-slate-600">
              &ldquo;{waMessage}&rdquo;
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="size-4" />
              <span>Chat WhatsApp</span>
            </a>
            {telHref ? (
              <a
                href={telHref}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition-colors hover:text-primary"
              >
                <Phone className="size-3.5" />
                <span>Telepon</span>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {!waUrl && telHref ? (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6">
          <div>
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-bold text-slate-900">
              Telepon Mitra
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-700 tabular-nums">
              {partner.phone}
            </p>
          </div>
          <a
            href={telHref}
            className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90"
          >
            <Phone className="size-4" />
            <span>Hubungi Telepon</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
