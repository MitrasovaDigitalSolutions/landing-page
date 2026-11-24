import type { ServicesLayout } from "@/types/site-settings.types";

const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function resolveServicesLayout(raw?: string | null): ServicesLayout {
  if (raw === "carousel" || raw === "grid") {
    return raw;
  }
  return "accordion";
}

export function formatServicePrice(price?: number | null): string | null {
  if (price === null || price === undefined || !Number.isFinite(price)) {
    return null;
  }
  return IDR_FORMATTER.format(price);
}
