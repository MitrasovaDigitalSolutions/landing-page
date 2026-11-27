import { Building2, ShieldCheck } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import type { Partner } from "@/types/api.types";

interface PartnerHeroCardProps {
  partner: Partner;
  siteName: string;
}

export function PartnerHeroCard({
  partner,
  siteName,
}: PartnerHeroCardProps): React.JSX.Element {
  return (
    <div className="mt-6 flex flex-col items-start gap-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
      <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:size-28">
        <SmartImage
          src={partner.logo_url}
          fallbackPath={partner.logo_path}
          alt={partner.name}
          fill
          sizes="112px"
          className="object-contain p-2"
          fallback={<Building2 className="size-10 text-primary" />}
        />
      </div>

      <div className="min-w-0 space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-bold tracking-wider text-primary uppercase">
          <ShieldCheck className="size-3.5" />
          <span>Mitra Resmi {siteName}</span>
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {partner.name}
        </h1>
        <p className="text-sm text-slate-600">
          Informasi tautan resmi dan kontak mitra yang terhubung dengan{" "}
          {siteName}.
        </p>
      </div>
    </div>
  );
}
