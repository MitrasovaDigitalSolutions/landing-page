"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProductCategoryCard } from "@/features/services/components/product-category-card";
import {
  groupServicesByCategory,
  resolveCategoryGridClass,
} from "@/features/services/utils/group-services";
import { cn } from "@/lib/utils";
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
  title = "Produk & Layanan",
  subtitle = "Klik produk pada masing-masing kategori untuk melihat ringkasan fitur dan ketentuannya.",
  showAllPageLink = false,
  defaultExpandFirst = false,
}: ProductsAccordionSectionProps): React.JSX.Element | null {
  const groups = useMemo(
    () => groupServicesByCategory(services, types),
    [services, types]
  );

  if (groups.length === 0) {
    return null;
  }

  const gridClass = resolveCategoryGridClass(groups.length);
  const firstService = groups.at(0)?.services.at(0);
  const initialExpanded =
    defaultExpandFirst && firstService ? [String(firstService.id)] : [];

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

        <Accordion
          multiple={false}
          defaultValue={initialExpanded}
          className={cn("grid w-full items-start gap-5 lg:gap-6", gridClass)}
        >
          {groups.map((group) => (
            <ProductCategoryCard key={group.key} group={group} />
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
