import { Quote, Star } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/api.types";

interface TestimonialMarqueeCardProps {
  item: Testimonial;
}

export function TestimonialMarqueeCard({
  item,
}: TestimonialMarqueeCardProps): React.JSX.Element {
  return (
    <Card className="mx-3 flex w-[290px] shrink-0 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md sm:w-[340px] sm:p-5">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < item.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                )}
              />
            ))}
          </div>
          <Quote className="size-4 text-slate-300" />
        </div>

        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-700 sm:text-[13px]">
          &ldquo;{item.message}&rdquo;
        </p>
      </div>

      <div className="mt-3.5 flex items-center gap-2.5 border-t border-slate-100 pt-3">
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-primary/10">
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
          <h4 className="truncate text-xs font-bold text-slate-900 sm:text-sm">
            {item.name}
          </h4>
          {item.title ? (
            <p className="truncate text-[11px] text-slate-500">{item.title}</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
