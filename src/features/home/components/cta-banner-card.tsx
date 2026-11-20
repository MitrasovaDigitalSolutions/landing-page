import { Button } from "@/components/ui/button";
import { resolvePrimaryCta } from "@/features/home/utils/section-normalizer";
import type { PageSection } from "@/types/api.types";
import { ArrowRight, PhoneCall } from "lucide-react";

interface CtaBannerCardProps {
  section: PageSection;
}

export function CtaBannerCard({
  section,
}: CtaBannerCardProps): React.JSX.Element {
  const title = section.title ?? "Siap Bermitra Bersama Kami?";
  const subtitle =
    section.subtitle ?? "Konsultasi & Penawaran Solusi Terbaik";
  const body =
    section.body ??
    "Diskusikan kebutuhan finansial atau operasional usaha Anda bersama tim analis dan konsultan resmi kami.";
  const cta = resolvePrimaryCta(section, "Hubungi Kami");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
      <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-xs">
            <PhoneCall className="size-3.5" />
            <span>{subtitle}</span>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
            {body}
          </p>
        </div>

        <div className="shrink-0">
          <Button
            size="lg"
            nativeButton={false}
            className="h-12 rounded-xl bg-white px-7 font-bold text-primary shadow-lg hover:bg-slate-50"
            render={<a href={cta.url} />}
          >
            <span>{cta.text}</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
