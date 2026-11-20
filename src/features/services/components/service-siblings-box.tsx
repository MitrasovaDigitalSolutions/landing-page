import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/types/api.types";

interface ServiceSiblingsBoxProps {
  typeLabel: string;
  services: Service[];
}

export function ServiceSiblingsBox({
  typeLabel,
  services,
}: ServiceSiblingsBoxProps): React.JSX.Element | null {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-[#F7F9F7] p-5">
      <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
        Produk {typeLabel} Lainnya
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {services.map((item) => (
          <Link
            key={item.id}
            href={`/services/${item.slug}`}
            className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="truncate">{item.name}</span>
            <ArrowUpRight className="size-3.5 shrink-0 text-slate-400 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
