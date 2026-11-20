"use client";

import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import type { Service, ServiceType } from "@/types/api.types";

interface NavbarProductsPanelProps {
  serviceTypes: ServiceType[];
  services: Service[];
}

export function NavbarProductsPanel({
  serviceTypes,
  services,
}: NavbarProductsPanelProps): React.JSX.Element {
  const grouped = serviceTypes
    .map((type) => ({
      type,
      items: services.filter((s) => s.service_type_id === type.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="grid w-[560px] grid-cols-12 gap-4 p-4 lg:w-[660px]">
      <div className="col-span-5 flex flex-col justify-between rounded-xl border border-primary/15 bg-primary/5 p-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-primary uppercase">
            <Layers className="size-3.5" />
            <span>Produk & Layanan</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            Solusi simpanan & pinjaman terpercaya untuk mendukung kemandirian
            ekonomi anggota dan keluarga.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-primary/10 pt-3">
          <NavigationMenuLink
            closeOnClick
            render={<Link href="/produk" />}
            className="justify-between rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/10"
          >
            <span>Semua Produk & Ketentuan</span>
            <ArrowRight className="size-3.5" />
          </NavigationMenuLink>
          <NavigationMenuLink
            closeOnClick
            render={<Link href="/kontak" />}
            className="justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white hover:text-primary"
          >
            <span>Konsultasi Produk</span>
            <ArrowRight className="size-3.5" />
          </NavigationMenuLink>
        </div>
      </div>

      <div className="col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {grouped.length > 0 ? (
          grouped.map(({ type, items }) => (
            <div key={type.id} className="space-y-1.5">
              <p className="px-2.5 text-[11px] font-bold tracking-wider text-primary uppercase">
                {type.name}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((service) => (
                  <NavigationMenuLink
                    key={service.id}
                    closeOnClick
                    render={<Link href={`/services/${service.slug}`} />}
                    className="group justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary"
                  >
                    <span className="truncate">{service.name}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full space-y-1.5">
            <p className="px-2.5 text-[11px] font-bold tracking-wider text-primary uppercase">
              Daftar Layanan
            </p>
            <div className="grid grid-cols-2 gap-1">
              {services.map((service) => (
                <NavigationMenuLink
                  key={service.id}
                  closeOnClick
                  render={<Link href={`/services/${service.slug}`} />}
                  className="group justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary"
                >
                  <span className="truncate">{service.name}</span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </NavigationMenuLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
