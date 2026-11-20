import { Container } from "@/components/layout/container";
import { CtaBannerCard } from "@/features/home/components/cta-banner-card";
import type { PageSection } from "@/types/api.types";

interface CtaBannerSectionProps {
  section: PageSection;
}

export function CtaBannerSection({
  section,
}: CtaBannerSectionProps): React.JSX.Element {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <CtaBannerCard section={section} />
      </Container>
    </section>
  );
}
