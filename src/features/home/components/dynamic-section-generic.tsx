import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageSection } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface DynamicSectionGenericProps {
  section: PageSection;
  index: number;
}

export function DynamicSectionGeneric({
  section,
  index,
}: DynamicSectionGenericProps): React.JSX.Element | null {
  const imageUrl = resolveMediaUrl(
    section.payload?.image_url ?? section.image_url,
    section.payload?.image_path ?? section.image_path
  );
  const paragraphs = (section.body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const ctaLabel =
    section.payload?.cta_primary?.text ??
    section.payload?.cta_text ??
    section.payload?.button_label ??
    section.payload?.button_text;
  const ctaUrl =
    section.payload?.cta_primary?.url ??
    section.payload?.cta_url ??
    section.payload?.button_url ??
    section.payload?.button_link ??
    "/kontak";

  if (!section.title && paragraphs.length === 0 && !imageUrl) {
    return null;
  }

  const badge = section.payload?.badge ?? section.subtitle;
  const isExternal = ctaUrl.startsWith("http");

  return (
    <section
      className={cn(
        "border-b border-slate-200/80 py-9 md:py-12",
        index % 2 === 0 ? "bg-white" : "bg-[#F7F9F7]"
      )}
    >
      <Container
        className={cn(
          imageUrl
            ? "grid grid-cols-1 items-center gap-8 lg:grid-cols-12"
            : "max-w-4xl"
        )}
      >
        <div className={cn(imageUrl ? "lg:col-span-7" : "")}>
          {badge ? (
            <div className="mb-2.5 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                {badge}
              </span>
            </div>
          ) : null}

          {section.title ? (
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {section.title}
            </h2>
          ) : null}

          {paragraphs.length > 0 ? (
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {paragraphs.map((text, idx) => (
                <p key={`p-${idx}`}>{text}</p>
              ))}
            </div>
          ) : null}

          {ctaLabel ? (
            <div className="mt-6">
              <Button
                size="sm"
                nativeButton={false}
                className="h-10 gap-1.5 rounded-xl px-5 text-xs font-bold"
                render={
                  isExternal ? (
                    <a href={ctaUrl} target="_blank" rel="noopener noreferrer" />
                  ) : (
                    <Link href={ctaUrl} />
                  )
                }
              >
                <span>{ctaLabel}</span>
                <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          ) : null}
        </div>

        {imageUrl ? (
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs lg:col-span-5">
            <SmartImage
              src={imageUrl}
              alt={section.title ?? "Ilustrasi"}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
