import type { ReactNode } from "react";
import { VisionMissionSection } from "@/components/sections/vision-mission-section";
import { AboutStatsSection } from "@/features/home/components/about-stats-section";
import { CtaBannerSection } from "@/features/home/components/cta-banner-section";
import { FeaturedProductsSection } from "@/features/home/components/featured-products-section";
import { HeadOfficeSection } from "@/features/home/components/head-office-section";
import { HeroSection } from "@/features/home/components/hero-section";
import type { PageSection, Service } from "@/types/api.types";
import type {
  SiteContactSettings,
  SiteLegalSettings,
} from "@/types/site-settings.types";

interface SectionRendererProps {
  sections: PageSection[];
  allowedKeys?: readonly string[];
  services?: Service[];
  contact?: SiteContactSettings;
  legal?: SiteLegalSettings;
  renderProductsSection?: (section: PageSection) => ReactNode;
}

const SUPPORTED_SECTION_KEYS = new Set<string>([
  "hero",
  "featured",
  "products",
  "office",
  "about",
  "visi-misi",
  "vision_mission",
  "cta",
]);

export function SectionRenderer({
  sections,
  allowedKeys,
  services,
  contact,
  legal,
  renderProductsSection,
}: SectionRendererProps): React.JSX.Element | null {
  const keyFilter = allowedKeys ? new Set(allowedKeys) : SUPPORTED_SECTION_KEYS;
  const visibleSections = sections
    .filter(
      (section) => section.is_active !== false && keyFilter.has(section.key)
    )
    .sort((a, b) => a.order - b.order);

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <>
      {visibleSections.map((section) => {
        switch (section.key) {
          case "hero":
            return <HeroSection key={section.id} section={section} />;
          case "featured":
            return (
              <FeaturedProductsSection
                key={section.id}
                section={section}
                services={services}
              />
            );
          case "products":
            return renderProductsSection ? renderProductsSection(section) : null;
          case "office":
            return (
              <HeadOfficeSection
                key={section.id}
                section={section}
                contact={contact}
                legal={legal}
              />
            );
          case "about":
            return <AboutStatsSection key={section.id} section={section} />;
          case "visi-misi":
          case "vision_mission":
            if (section.payload?.visi || section.payload?.misi?.length) {
              return <VisionMissionSection key={section.id} section={section} />;
            }
            return <AboutStatsSection key={section.id} section={section} />;
          case "cta":
            return <CtaBannerSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
