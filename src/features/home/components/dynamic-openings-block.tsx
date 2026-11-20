import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PageSectionOpening } from "@/types/api.types";

interface DynamicOpeningsBlockProps {
  openings: PageSectionOpening[];
}

export function DynamicOpeningsBlock({
  openings,
}: DynamicOpeningsBlockProps): React.JSX.Element {
  if (openings.length === 0) {
    return (
      <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-[#F7F9F7] p-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
            <Briefcase className="size-3.5" />
            <span>Informasi Lowongan</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            Saat ini belum ada posisi lowongan terbuka yang dipublikasikan.
          </p>
          <p className="text-xs text-slate-600">
            Anda tetap dapat mengirimkan profil atau pertanyaan karir melalui
            halaman kontak resmi kami.
          </p>
        </div>

        <Button
          size="sm"
          nativeButton={false}
          className="h-10 shrink-0 gap-1.5 self-start rounded-xl px-4 text-xs font-bold sm:self-auto"
          render={<Link href="/kontak" />}
        >
          <span>Hubungi Tim HRD</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      <h3 className="text-base font-extrabold tracking-tight text-slate-900">
        Lowongan Terbuka ({openings.length})
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {openings.map((job, idx) => (
          <div
            key={`${job.title}-${idx}`}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {job.type ? (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    {job.type}
                  </span>
                ) : null}
                {job.location ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3 text-primary" />
                    {job.location}
                  </span>
                ) : null}
              </div>
              <h4 className="mt-2 text-base font-bold text-slate-900">
                {job.title}
              </h4>
              {job.description ? (
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {job.description}
                </p>
              ) : null}
            </div>

            <Button
              variant="outline"
              size="xs"
              nativeButton={false}
              className="h-9 w-fit gap-1.5 rounded-xl border-slate-200 px-3.5 text-xs font-bold"
              render={<Link href="/kontak" />}
            >
              <span>Kirim Lamaran</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
