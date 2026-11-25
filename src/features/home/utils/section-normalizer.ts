import type {
  PageSection,
  PageSectionCta,
  PageSectionFeaturedCard,
  PageSectionSlide,
  PageSectionStat,
} from "@/types/api.types";

function normalizeCtaUrl(rawUrl?: string): string {
  if (!rawUrl || rawUrl === "/inquiry" || rawUrl === "#inquiry") {
    return "#contact";
  }
  return rawUrl;
}

export function resolvePrimaryCta(
  section: PageSection,
  fallbackText = "Lihat Produk Kami",
  fallbackUrl = "#featured"
): PageSectionCta {
  const payload = section.payload;
  const text =
    payload?.cta_primary?.text ??
    payload?.cta_text ??
    payload?.button_label ??
    payload?.button_text ??
    fallbackText;
  const rawUrl =
    payload?.cta_primary?.url ??
    payload?.cta_url ??
    payload?.button_url ??
    payload?.button_link;

  return {
    text,
    url: rawUrl ? normalizeCtaUrl(rawUrl) : fallbackUrl,
  };
}

export function resolveSecondaryCta(
  section: PageSection,
  fallbackText = "Hubungi Kami",
  fallbackUrl = "#office"
): PageSectionCta {
  const payload = section.payload;

  if (payload?.cta_secondary?.text) {
    return {
      text: payload.cta_secondary.text,
      url: normalizeCtaUrl(payload.cta_secondary.url),
    };
  }

  return {
    text: fallbackText,
    url: fallbackUrl,
  };
}

export function resolveHeroSlides(section: PageSection): PageSectionSlide[] {
  const slides = section.payload?.slides;
  if (Array.isArray(slides) && slides.length > 0) {
    return slides.filter((s) => Boolean(s.title));
  }

  return [
    {
      title: section.title ?? "Solusi Layanan Profesional & Terpercaya",
      description:
        section.body ??
        "Melayani anggota dan masyarakat dengan tata kelola yang transparan, aman, dan berintegritas.",
      badge: section.subtitle,
      image_path: section.image_path,
      image_url: section.image_url,
    },
  ];
}

export function resolveFeaturedCards(
  section: PageSection
): PageSectionFeaturedCard[] {
  const cards = section.payload?.cards;
  if (!Array.isArray(cards) || cards.length === 0) {
    return [];
  }
  return cards.filter((c) => Boolean(c.title));
}

export function isVisionMissionKey(key: string): boolean {
  return key === "visi-misi" || key === "vision_mission";
}

export function resolveSectionStats(section: PageSection): PageSectionStat[] {
  const rawStats = section.payload?.stats;
  if (!Array.isArray(rawStats) || rawStats.length === 0) {
    return [];
  }
  return rawStats;
}
