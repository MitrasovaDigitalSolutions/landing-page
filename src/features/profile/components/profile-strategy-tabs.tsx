"use client";

import { Container } from "@/components/layout/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStrategyGrid } from "@/features/profile/components/profile-strategy-grid";
import type { PageSection } from "@/types/api.types";

interface ProfileStrategyTabsProps {
  strategySection?: PageSection;
  programSection?: PageSection;
}

export function ProfileStrategyTabs({
  strategySection,
  programSection,
}: ProfileStrategyTabsProps): React.JSX.Element | null {
  const strategyItems = strategySection?.payload?.items ?? [];
  const programItems = programSection?.payload?.items ?? [];

  if (strategyItems.length === 0 && programItems.length === 0) {
    return null;
  }

  const defaultTab = strategyItems.length > 0 ? "strategi" : "program";

  return (
    <section className="border-b border-slate-200/80 bg-white py-9 md:py-12">
      <Container>
        <div className="mb-6 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              Implementasi Nyata
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Strategi & Program Kerja
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Pilar strategis dan inisiatif nyata koperasi dalam melayani anggota
            dan menggerakkan ekonomi lokal.
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="gap-6">
          <TabsList className="bg-slate-100">
            {strategyItems.length > 0 ? (
              <TabsTrigger value="strategi" className="text-xs font-bold sm:text-sm">
                {strategySection?.title ?? "Strategi"}
              </TabsTrigger>
            ) : null}
            {programItems.length > 0 ? (
              <TabsTrigger value="program" className="text-xs font-bold sm:text-sm">
                {programSection?.title ?? "Program Kerja"}
              </TabsTrigger>
            ) : null}
          </TabsList>

          {strategyItems.length > 0 ? (
            <TabsContent value="strategi">
              <ProfileStrategyGrid items={strategyItems} />
            </TabsContent>
          ) : null}

          {programItems.length > 0 ? (
            <TabsContent value="program">
              <ProfileStrategyGrid items={programItems} />
            </TabsContent>
          ) : null}
        </Tabs>
      </Container>
    </section>
  );
}
