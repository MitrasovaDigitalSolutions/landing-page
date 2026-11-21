"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageSectionCta, PageSectionSlide } from "@/types/api.types";

interface HeroSlideProps {
  slide: PageSectionSlide;
  isFirst: boolean;
  isActive: boolean;
  compact?: boolean;
  primaryCta: PageSectionCta;
  secondaryCta: PageSectionCta;
}

export function HeroSlide({
  slide,
  isFirst,
  isActive,
  compact = false,
  primaryCta,
  secondaryCta,
}: HeroSlideProps): React.JSX.Element {
  const TitleTag = isFirst ? "h1" : "h2";
  const heightClass = compact
    ? "min-h-[320px] md:min-h-[360px]"
    : "min-h-[520px] md:min-h-[580px]";
  const spacingClass = compact
    ? "pt-10 pb-16 md:pt-12 md:pb-18"
    : "pt-24 pb-20 md:pt-28 md:pb-24";

  return (
    <div
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-slate-950",
        heightClass
      )}
    >
      <SmartImage
        src={slide.image_url}
        fallbackPath={slide.image_path}
        alt={slide.title}
        fill
        sizes="100vw"
        priority={isFirst}
        className="object-cover object-center"
        fallbackClassName="bg-slate-900"
        fallback={
          <Image
            src="/images/hero-corporate.jpg"
            alt={slide.title}
            fill
            priority={isFirst}
            unoptimized
            className="object-cover object-center"
          />
        }
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/70 to-transparent"
      />

      <Container
        className={cn(
          "relative z-10 flex flex-col justify-center",
          heightClass,
          spacingClass
        )}
      >
        <motion.div
          className="max-w-2xl"
          initial={isFirst ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 12 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {slide.badge ? (
            <div className="mb-4 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.16em] text-white/90 uppercase">
                {slide.badge}
              </span>
            </div>
          ) : null}

          <TitleTag className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
            {slide.title}
          </TitleTag>

          {slide.description ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
              {slide.description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="h-12 gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md hover:bg-primary/90"
              render={<a href={primaryCta.url} />}
            >
              <span>{primaryCta.text}</span>
              <ArrowRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-12 rounded-xl border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/20 hover:text-white"
              render={<a href={secondaryCta.url} />}
            >
              {secondaryCta.text}
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
