import { Toaster } from "@/components/ui/sonner";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { ProgressProvider } from "@/providers/progress-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SiteProvider } from "@/providers/site-provider";
import { getSiteSettings } from "@/services/api/settings.service";
import { generateBrandCssVariables } from "@/utils/color";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);

  try {
    const settings = await getSiteSettings(siteKey);
    const title = settings.general?.site_title ?? config.name;
    const description =
      settings.general?.tagline ??
      `Layanan resmi dan terpercaya dari ${config.name}`;

    return {
      title: {
        default: title,
        template: `%s | ${title}`,
      },
      description,
      keywords: settings.general?.meta_keywords,
    };
  } catch {
    return {
      title: config.name,
      description: `Portal resmi ${config.name}`,
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const settings = await getSiteSettings(siteKey);
  const brandVars = generateBrandCssVariables(
    settings.general?.brand_color ?? config.defaultBrandColor
  );

  return (
    <html
      lang="id"
      className={`${fontSans.variable} h-full scroll-smooth antialiased`}
      style={brandVars}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 selection:bg-primary/15 selection:text-primary">
        <ProgressProvider>
          <QueryProvider>
            <SiteProvider config={config} settings={settings}>
              {children}
              <Toaster richColors position="top-right" />
            </SiteProvider>
          </QueryProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
