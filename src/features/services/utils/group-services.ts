import type { Service, ServiceType } from "@/types/api.types";

export interface ServiceCategoryGroup {
  key: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  services: Service[];
}

export function groupServicesByCategory(
  services: Service[],
  types: ServiceType[]
): ServiceCategoryGroup[] {
  const sortedTypes = [...types].sort((a, b) => a.order - b.order);
  const assignedIds = new Set<number>();
  const groups: ServiceCategoryGroup[] = [];

  for (const type of sortedTypes) {
    const matched = services
      .filter(
        (service) =>
          service.service_type_id === type.id ||
          service.service_type?.slug === type.slug
      )
      .sort((a, b) => a.order - b.order);

    if (matched.length === 0) {
      continue;
    }

    for (const service of matched) {
      assignedIds.add(service.id);
    }

    groups.push({
      key: `type-${type.id}`,
      name: type.name,
      slug: type.slug,
      description: type.description,
      icon: type.icon,
      services: matched,
    });
  }

  const remaining = services
    .filter((service) => !assignedIds.has(service.id))
    .sort((a, b) => a.order - b.order);

  if (remaining.length > 0) {
    const fallbackMap = new Map<string, ServiceCategoryGroup>();

    for (const service of remaining) {
      const slug = service.service_type?.slug ?? "lainnya";
      const existing = fallbackMap.get(slug);
      if (existing) {
        existing.services.push(service);
      } else {
        fallbackMap.set(slug, {
          key: `fallback-${slug}`,
          name: service.service_type?.name ?? "Layanan Lainnya",
          slug,
          description: service.service_type?.description ?? null,
          icon: service.service_type?.icon ?? null,
          services: [service],
        });
      }
    }

    groups.push(...fallbackMap.values());
  }

  return groups;
}

export function resolveCategoryGridClass(categoryCount: number): string {
  if (categoryCount <= 1) {
    return "mx-auto max-w-3xl grid-cols-1";
  }
  if (categoryCount === 2 || categoryCount === 4) {
    return categoryCount === 2
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2";
  }
  return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
}
