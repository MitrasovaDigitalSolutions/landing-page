"use client";

import { ProductCard } from "@/features/services/components/product-card";
import { ServiceTypeTabs } from "@/features/services/components/service-type-tabs";
import { useServicesFilter } from "@/features/services/hooks/use-services-filter";
import type { Service, ServiceType } from "@/types/api.types";

interface ProductGridProps {
  services: Service[];
  types?: ServiceType[];
  enableCategoryFilter?: boolean;
}

export function ProductGrid({
  services,
  types = [],
  enableCategoryFilter = false,
}: ProductGridProps): React.JSX.Element | null {
  const { selectedTypeSlug, setSelectedTypeSlug, filteredServices } =
    useServicesFilter(services);

  if (services.length === 0) {
    return null;
  }

  const showCategoryTabs = enableCategoryFilter && types.length > 1;
  const visibleServices = showCategoryTabs ? filteredServices : services;

  return (
    <div>
      {showCategoryTabs ? (
        <ServiceTypeTabs
          types={types}
          totalCount={services.length}
          selectedTypeSlug={selectedTypeSlug}
          onSelectType={setSelectedTypeSlug}
        />
      ) : null}

      {visibleServices.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {visibleServices.map((service) => (
            <ProductCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Belum ada produk pada kategori ini.
        </div>
      )}
    </div>
  );
}
