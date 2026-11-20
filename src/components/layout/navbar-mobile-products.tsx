"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Service, ServiceType } from "@/types/api.types";

interface NavbarMobileProductsProps {
  serviceTypes: ServiceType[];
  services: Service[];
  onNavigate: () => void;
}

export function NavbarMobileProducts({
  serviceTypes,
  services,
  onNavigate,
}: NavbarMobileProductsProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  const grouped = serviceTypes
    .map((type) => ({
      type,
      items: services.filter((s) => s.service_type_id === type.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60">
      <button
        type="button"
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
        className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-slate-800"
      >
        <span>Produk & Layanan</span>
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 transition-transform duration-200",
            expanded ? "rotate-180 text-primary" : ""
          )}
        />
      </button>

      {expanded ? (
        <div className="space-y-3 border-t border-slate-200/70 px-3.5 py-3">
          {grouped.length > 0 ? (
            grouped.map(({ type, items }) => (
              <div key={type.id}>
                <p className="mb-1 text-[11px] font-bold tracking-wider text-primary uppercase">
                  {type.name}
                </p>
                <div className="flex flex-col gap-0.5">
                  {items.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      onClick={onNavigate}
                      className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-primary"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-0.5">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  onClick={onNavigate}
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-primary"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/produk"
            onClick={onNavigate}
            className="block rounded-lg bg-primary/10 px-2.5 py-1.5 text-center text-xs font-bold text-primary"
          >
            Lihat Semua Produk
          </Link>
        </div>
      ) : null}
    </div>
  );
}
