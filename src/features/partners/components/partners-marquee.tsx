"use client";

import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import type { Partner } from "@/types/api.types";
import { Building2, ExternalLink } from "lucide-react";
import Marquee from "react-fast-marquee";

interface PartnersMarqueeProps {
  partners: Partner[];
}

export function PartnersSection({
  partners,
}: PartnersMarqueeProps): React.JSX.Element | null {
  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-slate-200/70 bg-slate-50/70 py-10">
      <Container>
        <div className="mb-6 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <div>
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              Jaringan & Kemitraan
            </span>
            <h3 className="mt-0.5 text-base font-bold text-slate-900">
              Dipercaya oleh Institusi & Mitra Strategis
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Kolaborasi resmi lintas perbankan & asosiasi usaha
          </span>
        </div>
      </Container>

      <Marquee
        autoFill
        pauseOnHover
        speed={38}
        gradient
        gradientColor="#f8fafc"
        gradientWidth={72}
      >
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.website_url ?? "#"}
            target={partner.website_url ? "_blank" : undefined}
            rel={partner.website_url ? "noopener noreferrer" : undefined}
            className="mx-3 flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-primary/5 p-1.5">
              <SmartImage
                src={partner.logo_url}
                fallbackPath={partner.logo_path}
                alt={partner.name}
                fill
                className="object-contain p-1"
                fallbackClassName="bg-primary/5"
                fallback={<Building2 className="size-5 text-primary" />}
              />
            </div>
            <div className="pr-2">
              <span className="block text-sm font-bold text-slate-900">
                {partner.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <span>Mitra Terverifikasi</span>
                <ExternalLink className="size-2.5" />
              </span>
            </div>
          </a>
        ))}
      </Marquee>
    </section>
  );
}
