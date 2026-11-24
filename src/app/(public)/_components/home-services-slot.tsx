import { SectionRenderer } from "@/features/home/components/section-renderer";
import { ProductsAccordionSection } from "@/features/services/components/products-accordion-section";
import { ProductsShowcaseSection } from "@/features/services/components/products-showcase-section";
import type { PageSection, Service, ServiceType } from "@/types/api.types";
import type { ServicesLayout } from "@/types/site-settings.types";

interface HomeServicesSlotProps {
  enabled: boolean;
  layout: ServicesLayout;
  sections: PageSection[];
  services: Service[];
  featuredServices: Service[];
  types: ServiceType[];
}

export function HomeServicesSlot({
  enabled,
  layout,
  sections,
  services,
  featuredServices,
  types,
}: HomeServicesSlotProps): React.JSX.Element | null {
  if (!enabled) {
    return null;
  }

  const featuredSection = sections.find((s) => s.key === "featured");
  const productsSection = sections.find((s) => s.key === "products");

  if (layout === "accordion") {
    return (
      <ProductsAccordionSection
        sectionId="featured"
        services={services}
        types={types}
        badge={featuredSection?.payload?.badge ?? "Layanan Kami"}
        title={featuredSection?.title ?? "Produk & Layanan"}
        subtitle={
          featuredSection?.body ??
          "Klik produk pada masing-masing kategori untuk melihat ringkasan fitur dan ketentuannya."
        }
        showAllPageLink
      />
    );
  }

  if (productsSection) {
    return (
      <SectionRenderer
        sections={sections}
        allowedKeys={["products"]}
        services={services}
        renderProductsSection={(section) => {
          const rawLimit = section.payload?.limit;
          const limit =
            typeof rawLimit === "number" && rawLimit > 0 ? rawLimit : 12;
          return (
            <ProductsShowcaseSection
              key={section.id}
              sectionId="products"
              services={featuredServices.slice(0, limit)}
              layout={layout}
              badge={section.payload?.badge ?? "Produk Unggulan"}
              title={section.title ?? "Produk Unggulan"}
              subtitle={section.subtitle ?? section.body}
              ctaLabel={section.payload?.cta_label ?? "Lihat Semua Produk"}
              ctaUrl={section.payload?.cta_url ?? "/produk"}
            />
          );
        }}
      />
    );
  }

  return (
    <ProductsShowcaseSection
      sectionId="featured"
      services={featuredServices}
      layout={layout}
      badge={featuredSection?.payload?.badge ?? "Produk Unggulan"}
      title={featuredSection?.title ?? "Produk Unggulan"}
      subtitle={featuredSection?.subtitle ?? featuredSection?.body}
      ctaLabel={featuredSection?.payload?.cta_label ?? "Lihat Semua Produk"}
      ctaUrl={featuredSection?.payload?.cta_url ?? "/produk"}
      showAllPageLink
    />
  );
}
