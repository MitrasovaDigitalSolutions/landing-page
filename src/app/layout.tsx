import { Toaster } from "@/components/ui/sonner";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import {
  buildSiteIcons,
  isIndexingEnabled,
  normalizeGoogleVerificationToken,
  parseCommaList,
  pickNonEmptyText,
  resolveSiteFaviconUrl,
  resolveSiteUrl,
  toAbsoluteSiteUrl,
} from "@/lib/seo";
import { ProgressProvider } from "@/providers/progress-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SiteProvider } from "@/providers/site-provider";
import { getSiteSettings } from "@/services/api/settings.service";
import { generateBrandCssVariables } from "@/utils/color";
import { resolveMediaUrl } from "@/utils/media";
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
  const settings = await getSiteSettings(siteKey);

  const siteUrl = resolveSiteUrl(settings);
  const siteName =
    pickNonEmptyText(settings.general?.site_title) ?? config.name;
  const tagline = pickNonEmptyText(settings.general?.tagline);
  const defaultTitle =
    pickNonEmptyText(settings.seo?.meta_title) ??
    (tagline ? `${siteName} — ${tagline}` : siteName);
  const description =
    pickNonEmptyText(settings.seo?.meta_description, tagline) ??
    `Layanan resmi dan terpercaya dari ${siteName}.`;
  const keywords = parseCommaList(settings.general?.meta_keywords);
  const faviconUrl = resolveSiteFaviconUrl(settings);
  const ogImage = toAbsoluteSiteUrl(
    resolveMediaUrl(settings.general?.logo_url, settings.general?.logo_path),
    siteUrl
  );
  const indexable = isIndexingEnabled(settings);
  const googleToken = normalizeGoogleVerificationToken(
    pickNonEmptyText(settings.seo?.google_verification) ??
      env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    applicationName: siteName,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    alternates: { canonical: "/" },
    icons: buildSiteIcons(faviconUrl),
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: siteUrl,
      siteName,
      title: defaultTitle,
      description,
      ...(ogImage ? { images: [{ url: ogImage, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: indexable
      ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
      : { index: false, follow: false },
    ...(googleToken ? { verification: { google: googleToken } } : {}),
  };
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
