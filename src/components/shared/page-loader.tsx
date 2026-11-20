"use client";

import { motion } from "motion/react";
import { SmartImage } from "@/components/shared/smart-image";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useSite } from "@/providers/site-provider";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

function getInitials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function PageLoader({
  message = "Menyiapkan halaman...",
  fullScreen = false,
}: PageLoaderProps): React.JSX.Element {
  const { config, settings } = useSite();
  const siteTitle = settings.general?.site_title ?? config.name;
  const initials = getInitials(siteTitle);
  const logoUrl = settings.general?.logo_url;
  const logoPath = settings.general?.logo_path;
  const hasLogo = Boolean(logoUrl ?? logoPath);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full items-center justify-center bg-white px-4 py-16",
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      )}
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-4 text-center">
        <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
          {hasLogo ? (
            <SmartImage
              src={logoUrl}
              fallbackPath={logoPath}
              alt={siteTitle}
              fill
              sizes="56px"
              className="object-contain p-1"
              fallbackClassName="bg-primary text-sm font-extrabold text-white"
              fallback={<span>{initials}</span>}
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
              {initials}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold tracking-tight text-slate-900">
            {siteTitle}
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Spinner className="size-3.5 text-primary" />
            <span>{message}</span>
          </div>
        </div>

        <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full w-1/2 rounded-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 1.15,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}
