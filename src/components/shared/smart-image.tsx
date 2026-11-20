"use client";

import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/utils/media";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

interface SmartImageProps {
  src?: string | null;
  fallbackPath?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fallbackClassName?: string;
  fallback?: ReactNode;
}

export function SmartImage({
  src,
  fallbackPath,
  alt,
  fill = false,
  width = 800,
  height = 600,
  sizes,
  priority = false,
  className,
  fallbackClassName,
  fallback,
}: SmartImageProps): React.JSX.Element {
  const resolvedSrc = resolveMediaUrl(src, fallbackPath);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!resolvedSrc || failedSrc === resolvedSrc) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-slate-100 text-slate-400",
          fallbackClassName
        )}
      >
        {fallback ?? <ImageOff className="size-6 opacity-50" />}
      </div>
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      unoptimized
      className={className}
      onError={() => {
        setFailedSrc(resolvedSrc);
      }}
    />
  );
}
