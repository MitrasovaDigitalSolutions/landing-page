import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/types/api.types";
import type {
  SiteContactSettings,
  SiteLegalSettings,
} from "@/types/site-settings.types";
import {
  resolveDirectMapsUrl,
  resolveMapsIframeSrc,
} from "@/utils/maps";

interface ContactOfficePanelProps {
  officeSection?: PageSection;
  contact?: SiteContactSettings;
  legal?: SiteLegalSettings;
}

export function ContactOfficePanel({
  officeSection,
  contact,
  legal,
}: ContactOfficePanelProps): React.JSX.Element {
  const title = officeSection?.title ?? "Kantor Pusat & Saluran Resmi";
  const address = officeSection?.body ?? contact?.address ?? "";
  const rawMapsEmbed =
    officeSection?.payload?.maps_embed ??
    contact?.maps_embed ??
    contact?.maps_embed_url;
  const mapsEmbed = resolveMapsIframeSrc(rawMapsEmbed);
  const mapsHref = resolveDirectMapsUrl(rawMapsEmbed, address);
  const waDigits = contact?.whatsapp?.replaceAll(/\D/g, "");

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-[#F7F9F7] p-5 sm:p-6">
      <div className="space-y-1">
        <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
          Lokasi & Kontak
        </span>
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>
      </div>

      {address ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed font-medium text-slate-700 sm:text-sm">
            {address}
          </p>
        </div>
      ) : null}

      <div className="space-y-2.5 text-sm">
        {contact?.phone ? (
          <a
            href={`tel:${contact.phone.replaceAll(/\s+/g, "")}`}
            className="flex items-center gap-2.5 font-semibold text-slate-700 transition-colors hover:text-primary"
          >
            <Phone className="size-4 shrink-0 text-primary" />
            <span>{contact.phone}</span>
          </a>
        ) : null}

        {waDigits ? (
          <a
            href={`https://wa.me/${waDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 font-semibold text-slate-700 transition-colors hover:text-primary"
          >
            <MessageCircle className="size-4 shrink-0 text-primary" />
            <span>WhatsApp: +{waDigits}</span>
          </a>
        ) : null}

        {contact?.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2.5 font-semibold text-slate-700 transition-colors hover:text-primary"
          >
            <Mail className="size-4 shrink-0 text-primary" />
            <span>{contact.email}</span>
          </a>
        ) : null}

        {legal?.badan_hukum ? (
          <div className="flex items-center gap-2.5 pt-1 text-xs font-medium text-slate-500">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            <span>Badan Hukum: {legal.badan_hukum}</span>
          </div>
        ) : null}
      </div>

      {mapsEmbed ? (
        <div className="h-[210px] overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 sm:h-[230px]">
          <iframe
            src={mapsEmbed}
            title={`Peta Lokasi ${title}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full border-0"
            allowFullScreen
          />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {mapsHref ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="h-9 gap-1.5 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-primary/40 hover:text-primary"
            render={
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" />
            }
          >
            <span>Buka Maps</span>
            <ExternalLink className="size-3.5" />
          </Button>
        ) : null}

        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          className="h-9 gap-1.5 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-primary/40 hover:text-primary"
          render={<Link href="/cabang" />}
        >
          <span>Lihat Cabang</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
