"use client";

import Marquee from "react-fast-marquee";
import { Container } from "@/components/layout/container";
import { TestimonialMarqueeCard } from "@/features/testimonials/components/testimonial-marquee-card";
import type { Testimonial } from "@/types/api.types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps): React.JSX.Element | null {
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
          <TestimonialMarqueeCard key={item.id} item={item} />
        ))}
      </Marquee>
    </section>
  );
}
