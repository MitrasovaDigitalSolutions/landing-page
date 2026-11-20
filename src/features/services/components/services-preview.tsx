"use client";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ServiceCard } from "@/features/services/components/service-card";
import { ServiceTypeTabs } from "@/features/services/components/service-type-tabs";
import { useServicesFilter } from "@/features/services/hooks/use-services-filter";
import type { Service, ServiceType } from "@/types/api.types";

interface ServicesPreviewProps {
  services: Service[];
  types: ServiceType[];
}

export function ServicesPreview({
  services,
  types,
}: ServicesPreviewProps): React.JSX.Element | null {
  const { selectedTypeSlug, setSelectedTypeSlug, filteredServices } =
    useServicesFilter(services);

  if (services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      className="border-b border-slate-200/80 bg-slate-50/60 py-16 md:py-24"
    >
      <Container>
        <SectionHeading
          badge="Katalog Produk & Layanan"
          title="Instrumen Layanan & Solusi Terukur"
          subtitle="Setiap produk dirancang dengan struktur syarat yang transparan, proses verifikasi terstandarisasi, dan manfaat optimal."
        />

        {types.length > 0 && (
          <ServiceTypeTabs
            types={types}
            totalCount={services.length}
            selectedTypeSlug={selectedTypeSlug}
            onSelectType={setSelectedTypeSlug}
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
