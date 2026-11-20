"use client";

import type { Service } from "@/types/api.types";
import { useMemo, useState } from "react";

export interface UseServicesFilterReturn {
  selectedTypeSlug: string;
  setSelectedTypeSlug: (slug: string) => void;
  filteredServices: Service[];
}

export function useServicesFilter(
  services: Service[]
): UseServicesFilterReturn {
  const [selectedTypeSlug, setSelectedTypeSlug] = useState<string>("all");

  const filteredServices = useMemo(() => {
    if (selectedTypeSlug === "all") {
      return services;
    }
    return services.filter(
      (s) => s.service_type?.slug === selectedTypeSlug
    );
  }, [services, selectedTypeSlug]);

  return {
    selectedTypeSlug,
    setSelectedTypeSlug,
    filteredServices,
  };
}
