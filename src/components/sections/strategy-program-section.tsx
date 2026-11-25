import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { StrategyProgramGrid } from "@/components/sections/strategy-program-grid";
import type { PageSection } from "@/types/api.types";

interface StrategyProgramSectionProps {
  section: PageSection;
}

export function StrategyProgramSection({
  section,
}: StrategyProgramSectionProps): React.JSX.Element | null {
  const items = section.payload?.items ?? [];
  if (items.length === 0 && !section.body) {
    return null;
  }

  const isProgram = section.key === "program";
  const defaultBadge = isProgram ? "Inisiatif Kerja" : "Arah Strategis";
  const defaultTitle = isProgram ? "Program Kerja" : "Strategi";

  return (
    <section className="border-b border-slate-200/80 bg-white py-9 md:py-12">
      <Container>
        <SectionHeading
          badge={section.payload?.badge ?? section.subtitle ?? defaultBadge}
          title={section.title ?? defaultTitle}
          subtitle={section.body ?? undefined}
        />
        {items.length > 0 ? <StrategyProgramGrid items={items} /> : null}
      </Container>
    </section>
  );
}
