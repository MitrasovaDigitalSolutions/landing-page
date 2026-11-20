import { Container } from "@/components/layout/container";
import { BusinessUnitCard } from "@/features/business-units/components/business-unit-card";
import type { BusinessUnit } from "@/types/api.types";

interface PublicBusinessUnitsGridProps {
  units: BusinessUnit[];
}

export function PublicBusinessUnitsGrid({
  units,
}: PublicBusinessUnitsGridProps): React.JSX.Element {
  const sortedUnits = [...units].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        {sortedUnits.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
            {sortedUnits.map((unit, idx) => (
              <BusinessUnitCard key={unit.id} unit={unit} index={idx} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-600">
              Data unit usaha belum tersedia saat ini.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
