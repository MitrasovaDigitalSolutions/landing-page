import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PartnerContactCards } from "@/features/partners/components/partner-contact-cards";
import { PartnerHeroCard } from "@/features/partners/components/partner-hero-card";
import { PartnerOtherGrid } from "@/features/partners/components/partner-other-grid";
import type { Partner } from "@/types/api.types";

interface PartnerDetailViewProps {
  partner: Partner;
  otherPartners: Partner[];
  siteName: string;
  siteUrl: string;
}

export function PartnerDetailView({
  partner,
  otherPartners,
  siteName,
  siteUrl,
}: PartnerDetailViewProps): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white py-10 md:py-14">
        <Container size="narrow">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <PartnerHeroCard partner={partner} siteName={siteName} />
        </Container>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-10 md:py-14">
        <Container size="narrow">
          <PartnerContactCards
            partner={partner}
            siteName={siteName}
            siteUrl={siteUrl}
          />
        </Container>
      </section>

      <PartnerOtherGrid partners={otherPartners} />
    </div>
  );
}
