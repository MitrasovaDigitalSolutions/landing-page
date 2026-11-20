"use client";

import type { SiteSettings } from "@/types/site-settings.types";
import type { SiteConfig } from "@/types/site.types";
import { generateBrandCssVariables } from "@/utils/color";
import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

interface SiteContextValue {
  config: SiteConfig;
  settings: SiteSettings;
}

const SiteContext = createContext<SiteContextValue | null>(null);

interface SiteProviderProps {
  config: SiteConfig;
  settings: SiteSettings;
  children: ReactNode;
}

export function SiteProvider({
  config,
  settings,
  children,
}: SiteProviderProps): React.JSX.Element {
  const brandColor = settings.general?.brand_color ?? config.defaultBrandColor;

  useEffect(() => {
    const vars = generateBrandCssVariables(brandColor);
    for (const [key, val] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, val);
    }
  }, [brandColor]);

  return (
    <SiteContext.Provider value={{ config, settings }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
