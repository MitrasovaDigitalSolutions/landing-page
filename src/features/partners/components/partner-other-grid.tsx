import { Building2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import type { Partner } from "@/types/api.types";

interface PartnerOtherGridProps {
  partners: Partner[];
}

export function PartnerOtherGrid({
  partners,
}: PartnerOtherGridProps): React.JSX.Element | null {
  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50/70 py-10 md:py-14">
      <Container>
        <h2 className="mb-5 text-lg font-bold text-slate-900">
          Mitra Resmi Lainnya
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((item) => (
            <Link
              key={item.id}
              href={`/mitra/${item.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-primary/5 p-1.5">
                <SmartImage
                  src={item.logo_url}
                  fallbackPath={item.logo_path}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                  fallback={<Building2 className="size-5 text-primary" />}
                />
              </div>
              <span className="truncate text-sm font-bold text-slate-900">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
