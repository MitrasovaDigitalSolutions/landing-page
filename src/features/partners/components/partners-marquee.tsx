"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import type { Partner } from "@/types/api.types";

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
          <Link
            key={partner.id}
            href={`/mitra/${partner.id}`}
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
            <span className="pr-2 text-sm font-bold text-slate-900">
              {partner.name}
            </span>
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
