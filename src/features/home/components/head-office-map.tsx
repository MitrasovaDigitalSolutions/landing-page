"use client";

import { MapPin } from "lucide-react";
import { motion } from "motion/react";

interface HeadOfficeMapProps {
  title: string;
  address: string;
  mapsEmbed?: string;
}

export function HeadOfficeMap({
  title,
  address,
  mapsEmbed,
}: HeadOfficeMapProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[340px] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm ring-1 ring-slate-900/[0.04] lg:col-span-7 lg:min-h-[420px]"
    >
      {mapsEmbed ? (
        <iframe
          src={mapsEmbed}
          title={`Peta Lokasi ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-[340px] w-full border-0 lg:min-h-[420px]"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
          <MapPin className="size-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">{title}</p>
          {address ? <p className="max-w-sm text-xs">{address}</p> : null}
        </div>
      )}
    </motion.div>
  );
}
