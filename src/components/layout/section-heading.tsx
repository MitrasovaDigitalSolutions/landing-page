import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  action,
  align = "left",
  className,
}: SectionHeadingProps): React.JSX.Element {
  const isCenter = align === "center";
  const wrapperAlign = isCenter
    ? "text-center md:flex-col md:items-center"
    : "";

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between",
        wrapperAlign,
        className
      )}
    >
      <div className={cn("max-w-2xl", isCenter && "mx-auto")}>
        {badge ? (
          <div className="mb-2.5 inline-flex items-center gap-2.5">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              {badge}
            </span>
          </div>
        ) : null}
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
