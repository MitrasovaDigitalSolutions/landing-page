import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/features/services/components/product-carousel";
import { ProductGrid } from "@/features/services/components/product-grid";
import type { Service } from "@/types/api.types";

interface ProductsShowcaseSectionProps {
  services: Service[];
  layout: "carousel" | "grid";
  sectionId?: string;
  badge?: string;
  title?: string;
  subtitle?: string | null;
  ctaLabel?: string;
  ctaUrl?: string;
  showAllPageLink?: boolean;
}

export function ProductsShowcaseSection({
  services,
  layout,
  sectionId = "products",
  badge = "Produk Unggulan",
  title = "Produk Unggulan",
  subtitle,
  ctaLabel = "Lihat Semua Produk",
  ctaUrl = "/produk",
  showAllPageLink = true,
}: ProductsShowcaseSectionProps): React.JSX.Element | null {
  if (services.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className="border-b border-slate-200/80 bg-[#F7F9F7] py-10 md:py-14"
    >
      <Container>
        <SectionHeading
          badge={badge}
          title={title}
          subtitle={subtitle ?? undefined}
          action={
            showAllPageLink ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="h-10 gap-2 rounded-xl border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 hover:border-primary/40 hover:text-primary"
                render={<Link href={ctaUrl} />}
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : undefined
          }
        />

        {layout === "carousel" ? (
          <ProductCarousel services={services} />
        ) : (
          <ProductGrid services={services} />
        )}
      </Container>
    </section>
  );
}
