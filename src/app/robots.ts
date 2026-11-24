import { env } from "@/config/env";
import { isIndexingEnabled, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings(env.NEXT_PUBLIC_SITE_KEY);
  const siteUrl = resolveSiteUrl(settings);

  if (!isIndexingEnabled(settings)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: siteUrl,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media/"],
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
