"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProductAccordionRow } from "@/features/services/components/product-accordion-row";
import { ServiceTypeTabs } from "@/features/services/components/service-type-tabs";
import { useServicesFilter } from "@/features/services/hooks/use-services-filter";
import type { Service, ServiceType } from "@/types/api.types";

interface ProductsAccordionSectionProps {
  services: Service[];
  types: ServiceType[];
  sectionId?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  showAllPageLink?: boolean;
  defaultExpandFirst?: boolean;
}

export function ProductsAccordionSection({
  services,
  types,
  sectionId = "featured",
  badge = "Layanan Kami",
  title = "Produk Simpanan & Pinjaman",
  subtitle = "Pilih kategori lalu klik produk untuk membaca fitur, setoran awal, dan persyaratannya.",
  showAllPageLink = false,
  defaultExpandFirst = true,
}: ProductsAccordionSectionProps): React.JSX.Element | null {
  const { selectedTypeSlug, setSelectedTypeSlug, filteredServices } =
    useServicesFilter(services);

  if (services.length === 0) {
    return null;
  }

  const firstItem = filteredServices.at(0);
  const initialExpanded =
    defaultExpandFirst && firstItem ? [String(firstItem.id)] : [];

  return (
    <section
      id={sectionId}
      className="border-b border-slate-200/80 bg-[#F7F9F7] py-10 md:py-14"
    >
      <Container>
        <SectionHeading
          badge={badge}
          title={title}
          subtitle={subtitle}
          action={
            showAllPageLink ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="h-10 gap-2 rounded-xl border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 hover:border-primary/40 hover:text-primary"
                render={<Link href="/produk" />}
              >
                <span>Buka Halaman Produk</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : undefined
          }
        />

        {types.length > 0 ? (
          <ServiceTypeTabs
            types={types}
            totalCount={services.length}
            selectedTypeSlug={selectedTypeSlug}
            onSelectType={setSelectedTypeSlug}
          />
        ) : null}

        <Accordion
          key={selectedTypeSlug}
          multiple
          defaultValue={initialExpanded}
          className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs"
        >
          {filteredServices.map((service, idx) => (
            <ProductAccordionRow
              key={service.id}
              service={service}
              index={idx}
            />
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
