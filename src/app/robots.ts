import { env } from "@/config/env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_API_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
