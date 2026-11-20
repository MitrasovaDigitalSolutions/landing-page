import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { SmartImage } from "@/components/shared/smart-image";
import { Card } from "@/components/ui/card";
import type { Testimonial } from "@/types/api.types";
import { Quote, Star } from "lucide-react";

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
      className="border-b border-slate-200/80 bg-slate-50/50 py-10 md:py-14"
    >
      <Container>
        <SectionHeading
          badge="Evaluasi & Testimoni"
          title="Pengalaman Anggota & Mitra Usaha"
          subtitle="Umpan balik terverifikasi dari nasabah dan pelaku usaha yang telah menggunakan layanan kami."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="size-5 text-slate-300" />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-primary/10">
                  <SmartImage
                    src={item.avatar_url}
                    fallbackPath={item.avatar_path}
                    alt={item.name}
                    fill
                    className="object-cover"
                    fallbackClassName="bg-primary/10 text-primary text-xs font-bold"
                    fallback={<span>{item.name.charAt(0).toUpperCase()}</span>}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-slate-900">
                    {item.name}
                  </h4>
                  {item.title && (
                    <p className="truncate text-xs text-slate-500">
                      {item.title}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
