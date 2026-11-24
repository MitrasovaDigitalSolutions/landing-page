"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/features/services/components/product-card";
import type { Service } from "@/types/api.types";

interface ProductCarouselProps {
  services: Service[];
}

export function ProductCarousel({
  services,
}: ProductCarouselProps): React.JSX.Element | null {
  if (services.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{ align: "start" }}
      aria-label="Produk unggulan"
      className="w-full"
    >
      <CarouselContent>
        {services.map((service) => (
          <CarouselItem
            key={service.id}
            className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
          >
            <ProductCard service={service} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        aria-label="Produk sebelumnya"
        className="left-2.5 border-slate-200 bg-white/95 text-slate-700 shadow-md hover:bg-white hover:text-primary disabled:opacity-0"
      />
      <CarouselNext
        aria-label="Produk berikutnya"
        className="right-2.5 border-slate-200 bg-white/95 text-slate-700 shadow-md hover:bg-white hover:text-primary disabled:opacity-0"
      />
    </Carousel>
  );
}
