"use client";

import { useState } from "react";
import Marquee from "react-fast-marquee";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Container } from "@/components/layout/container";
import { TestimonialMarqueeCard } from "@/features/testimonials/components/testimonial-marquee-card";
import type { Testimonial } from "@/types/api.types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps): React.JSX.Element | null {
  const [activePreview, setActivePreview] = useState<{
    src: string;
    name: string;
    title: string | null;
  } | null>(null);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="border-b border-slate-200/70 bg-slate-50/70 py-10"
    >
      <Container>
        <div className="mb-6 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <div>
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              Testimoni
            </span>
            <h2 className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">
              Kata Mereka Tentang Kami
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Ulasan nyata dari pelanggan dan mitra yang telah bekerja sama dengan kami
          </span>
        </div>
      </Container>

      <Marquee
        autoFill
        pauseOnHover
        speed={32}
        gradient
        gradientColor="#f8fafc"
        gradientWidth={72}
      >
        {testimonials.map((item) => (
          <TestimonialMarqueeCard
            key={item.id}
            item={item}
            onPreviewImage={(target, src) => {
              setActivePreview({
                src,
                name: target.name,
                title: target.title,
              });
            }}
          />
        ))}
      </Marquee>

      <Lightbox
        open={Boolean(activePreview)}
        close={() => {
          setActivePreview(null);
        }}
        slides={
          activePreview
            ? [
                {
                  src: activePreview.src,
                  alt: `Bukti testimoni ${activePreview.name}`,
                  title: activePreview.title
                    ? `${activePreview.name} — ${activePreview.title}`
                    : activePreview.name,
                },
              ]
            : []
        }
        plugins={[Zoom, Captions]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </section>
  );
}
