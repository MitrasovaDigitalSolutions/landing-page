"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import type { PageSection } from "@/types/api.types";

interface ProfileHeroProps {
  section?: PageSection;
  siteTitle: string;
  badanHukum?: string;
}

export function ProfileHero({
  section,
  siteTitle,
  badanHukum,
}: ProfileHeroProps): React.JSX.Element {
  const badge = section?.payload?.badge ?? "Tentang Kami";
  const title = section?.title ?? `Profil ${siteTitle}`;
  const description =
    section?.body ??
    `Mengenal lebih dekat sejarah, nilai dasar, visi, dan misi ${siteTitle}.`;
  const imageUrl = section?.payload?.image_url ?? section?.image_url;
  const imagePath = section?.payload?.image_path ?? section?.image_path;
  const imageLabel = section?.payload?.image_label;
  const imageCaption = section?.payload?.image_caption;

  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white py-8 md:py-12">
      <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              {badge}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            {title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {description}
          </p>

          {badanHukum ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold text-primary">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Badan Hukum: {badanHukum}</span>
            </div>
          ) : null}
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-md lg:col-span-6"
        >
          <div className="relative aspect-16/10 w-full">
            <SmartImage
              src={imageUrl}
              fallbackPath={imagePath}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {imageLabel || imageCaption ? (
            <figcaption className="flex items-start gap-2.5 border-t border-slate-200/80 bg-white px-5 py-3.5 text-xs text-slate-600">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                {imageLabel ? (
                  <p className="font-bold text-slate-900">{imageLabel}</p>
                ) : null}
                {imageCaption ? <p className="mt-0.5">{imageCaption}</p> : null}
              </div>
            </figcaption>
          ) : null}
        </motion.figure>
      </Container>
    </section>
  );
}
