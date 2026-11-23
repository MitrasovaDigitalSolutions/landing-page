import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { InquiryForm } from "@/features/inquiry/components/inquiry-form";
import { ServiceSiblingsBox } from "@/features/services/components/service-siblings-box";
import {
  getServiceBySlug,
  getServices,
} from "@/features/services/services/services.queries";
import { getSiteSettings } from "@/services/api/settings.service";
import { resolveMediaUrl } from "@/utils/media";

export const instant = false;

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getDistinctBodyParagraphs(body: string, features: string[]): string[] {
  const featureSet = new Set(features.map((f) => f.trim().toLowerCase()));
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => Boolean(line) && !featureSet.has(line.toLowerCase()));
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug, siteKey).catch(() => null),
    getServices(undefined, siteKey).catch(() => []),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );

  if (!effectiveModules.services || !service) {
    notFound();
  }

  const iconName = service.service_type?.icon ?? service.service_type?.slug;
  const typeLabel = service.service_type?.name ?? "Produk & Layanan";
  const hasImage = Boolean(
    resolveMediaUrl(service.thumbnail_url, service.thumbnail_path)
  );
  const features = service.features ?? [];
  const distinctBody = getDistinctBodyParagraphs(service.body, features);
  const points = features.length > 0 ? features : distinctBody;
  const siblingServices = allServices.filter(
    (s) => s.id !== service.id && s.service_type_id === service.service_type_id
  );
  const waDigits = settings.contact?.whatsapp?.replaceAll(/\D/g, "");
  const waUrl = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang ${service.name}.`)}`
    : null;

  return (
    <div>
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white py-6 md:py-8">
        <Container>
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Katalog Produk</span>
          </Link>

          <div className="mt-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-0.5 text-[11px] font-bold tracking-wider text-primary uppercase">
              <DynamicIcon name={iconName} className="size-3.5" />
              <span>{typeLabel}</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {service.name}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              {service.short_desc}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-7 md:py-10">
        <Container className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            {hasImage ? (
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <SmartImage
                  src={service.thumbnail_url}
                  fallbackPath={service.thumbnail_path}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
              <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
                Ketentuan & Keunggulan
              </span>
              <h2 className="mt-1 text-lg font-extrabold text-slate-900">
                Spesifikasi {service.name}
              </h2>

              {points.length > 0 ? (
                <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {features.length > 0 && distinctBody.length > 0 ? (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Informasi Tambahan
                </h2>
                <div className="mt-2.5 space-y-2 text-sm leading-relaxed text-slate-600">
                  {distinctBody.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ) : null}

            <ServiceSiblingsBox
              typeLabel={typeLabel}
              services={siblingServices}
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5">
            {waUrl ? (
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                className="h-11 w-full justify-center gap-2 rounded-xl border-primary/30 bg-primary/5 text-xs font-bold text-primary hover:bg-primary/10"
                render={
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" />
                }
              >
                <MessageCircle className="size-4" />
                <span>Tanya {service.name} via WhatsApp</span>
              </Button>
            ) : null}

            <InquiryForm
              compact
              defaultSubject={`Pengajuan ${service.name}`}
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
