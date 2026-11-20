"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import { HeroSlide } from "@/features/home/components/hero-slide";
import { cn } from "@/lib/utils";
import type { PageSectionCta, PageSectionSlide } from "@/types/api.types";

interface HeroCarouselProps {
  slides: PageSectionSlide[];
  compact?: boolean;
  primaryCta: PageSectionCta;
  secondaryCta: PageSectionCta;
}

export function HeroCarousel({
  slides,
  compact = false,
  primaryCta,
  secondaryCta,
}: HeroCarouselProps): React.JSX.Element {
  const hasMultiple = slides.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: hasMultiple });
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = (): void => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    const timer = hasMultiple
      ? window.setInterval(() => {
          if (!pausedRef.current) {
            emblaApi.scrollNext();
          }
        }, 6500)
      : undefined;

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [emblaApi, hasMultiple]);

  const currentSlideNumber = String(activeIndex + 1).padStart(2, "0");
  const totalSlideCount = String(slides.length).padStart(2, "0");

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, idx) => (
            <HeroSlide
              key={`${slide.title}-${idx}`}
              slide={slide}
              isFirst={idx === 0}
              isActive={idx === activeIndex}
              compact={compact}
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
            />
          ))}
        </div>
      </div>

      {hasMultiple ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 md:bottom-7">
          <Container className="flex items-center justify-between">
            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/15 bg-slate-950/35 px-3.5 py-2 backdrop-blur-md">
              <span className="text-xs font-bold tracking-wider text-white/90 tabular-nums">
                {currentSlideNumber} / {totalSlideCount}
              </span>
              <div className="flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={`${s.title}-dot-${idx}`}
                    type="button"
                    aria-label={`Slide ${idx + 1}: ${s.title}`}
                    onClick={() => {
                      emblaApi?.scrollTo(idx);
                    }}
                    className={cn(
                      "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                      idx === activeIndex
                        ? "w-7 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/65"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Slide sebelumnya"
                onClick={() => {
                  emblaApi?.scrollPrev();
                }}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-slate-950/35 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Slide berikutnya"
                onClick={() => {
                  emblaApi?.scrollNext();
                }}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-slate-950/35 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
