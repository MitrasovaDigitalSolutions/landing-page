import type { PageDetail } from "@/types/api.types";
import type { EffectiveModuleFlags } from "@/types/site.types";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

const ABOUT_GROUP_SLUGS = new Set(["profil", "cabang", "unit-usaha", "branches", "business-units"]);
const RESERVED_CORE_SLUGS = new Set([
  "home",
  "profil",
  "cabang",
  "branches",
  "unit-usaha",
  "business-units",
  "produk",
  "layanan",
  "services",
  "portofolio",
  "portfolio",
  "portfolios",
  "berita",
  "artikel",
  "news",
  "articles",
  "karir",
  "karier",
  "careers",
  "kontak",
  "contact",
]);

export function isSlugAllowedByModules(
  slug: string,
  modules: EffectiveModuleFlags
): boolean {
  switch (slug.trim().toLowerCase()) {
    case "cabang":
    case "branches":
      return modules.branches;
    case "unit-usaha":
    case "business-units":
      return modules.businessUnits;
    case "produk":
    case "layanan":
    case "services":
      return modules.services;
    case "portofolio":
    case "portfolio":
    case "portfolios":
      return modules.portfolios;
    case "berita":
    case "artikel":
    case "news":
    case "articles":
      return modules.articles;
    case "karir":
    case "karier":
    case "careers":
      return modules.careers;
    case "kontak":
    case "contact":
      return modules.contact;
    default:
      return true;
  }
}

export function isPublicPageVisible(
  page: PageDetail,
  modules?: EffectiveModuleFlags
): boolean {
  if (page.is_published === false || page.is_active === false) {
    return false;
  }
  return modules ? isSlugAllowedByModules(page.slug, modules) : true;
}

function toNavChildItem(page: PageDetail): NavItem {
  return {
    label: page.title,
    href: `/${page.slug}`,
    description: page.meta_desc ?? undefined,
  };
}

export function getHeaderNavigationItems(
  modules: EffectiveModuleFlags
): NavItem[] {
  const aboutChildren: NavItem[] = [
    {
      label: "Profil & Sejarah",
      href: "/profil",
      description: "Sejarah, visi misi, strategi & program kerja",
    },
  ];

  if (modules.branches) {
    aboutChildren.push({
      label: "Jaringan Cabang",
      href: "/cabang",
      description: "Lokasi kantor pusat & kantor cabang terdekat",
    });
  }

  if (modules.businessUnits) {
    aboutChildren.push({
      label: "Unit Usaha",
      href: "/unit-usaha",
      description: "Lini unit usaha grup untuk anggota & masyarakat",
    });
  }

  const items: NavItem[] = [
    { label: "Beranda", href: "/" },
    aboutChildren.length === 1 && aboutChildren[0]
      ? { label: "Profil", href: aboutChildren[0].href }
      : { label: "Tentang", href: "/profil", children: aboutChildren },
  ];

  if (modules.services) {
    items.push({ label: "Produk", href: "/produk" });
  }

  if (modules.portfolios) {
    items.push({ label: "Portofolio", href: "/portofolio" });
  }

  if (modules.articles) {
    items.push({ label: "Berita", href: "/berita" });
  }

  return items;
}

export function getNavigationItems(modules: EffectiveModuleFlags): NavItem[] {
  const items: NavItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profil" },
  ];

  if (modules.services) {
    items.push({ label: "Produk", href: "/produk" });
  }
  if (modules.portfolios) {
    items.push({ label: "Portofolio", href: "/portofolio" });
  }
  if (modules.branches) {
    items.push({ label: "Cabang", href: "/cabang" });
  }
  if (modules.businessUnits) {
    items.push({ label: "Unit Usaha", href: "/unit-usaha" });
  }
  if (modules.articles) {
    items.push({ label: "Berita", href: "/berita" });
  }
  if (modules.contact) {
    items.push({ label: "Kontak", href: "/kontak" });
  }

  return items;
}

export function buildHeaderNavigationFromPages(
  pages: PageDetail[],
  modules: EffectiveModuleFlags
): NavItem[] {
  const visible = pages.filter((page) => isPublicPageVisible(page, modules));
  if (visible.length === 0) {
    return getHeaderNavigationItems(modules);
  }

  const items: NavItem[] = [];
  const homePage = visible.find((p) => p.slug === "home");
  items.push({
    label: homePage?.title ?? "Beranda",
    href: "/",
  });

  const aboutPages = visible.filter((p) => ABOUT_GROUP_SLUGS.has(p.slug));
  const firstAbout = aboutPages.at(0);
  if (aboutPages.length === 1 && firstAbout) {
    items.push({ label: firstAbout.title, href: `/${firstAbout.slug}` });
  } else if (aboutPages.length > 1 && firstAbout) {
    items.push({
      label: "Tentang",
      href: `/${firstAbout.slug}`,
      children: aboutPages.map(toNavChildItem),
    });
  }

  const produkPage = visible.find((p) => p.slug === "produk");
  if (modules.services && produkPage) {
    items.push({ label: produkPage.title || "Produk", href: "/produk" });
  }

  const portofolioPage = visible.find(
    (p) => p.slug === "portofolio" || p.slug === "portfolio"
  );
  if (modules.portfolios && portofolioPage) {
    items.push({
      label: portofolioPage.title || "Portofolio",
      href: `/${portofolioPage.slug}`,
    });
  }

  const beritaPage = visible.find((p) => p.slug === "berita");
  if (modules.articles && beritaPage) {
    items.push({ label: beritaPage.title || "Berita", href: "/berita" });
  }

  const karirPage = visible.find((p) => p.slug === "karir");
  if (modules.careers && karirPage) {
    items.push({ label: karirPage.title || "Karir", href: "/karir" });
  }

  const extraPages = visible.filter(
    (p) => !RESERVED_CORE_SLUGS.has(p.slug.trim().toLowerCase())
  );
  const firstExtra = extraPages.at(0);
  if (extraPages.length === 1 && firstExtra) {
    items.push({ label: firstExtra.title, href: `/${firstExtra.slug}` });
  } else if (extraPages.length > 1 && firstExtra) {
    items.push({
      label: "Lainnya",
      href: `/${firstExtra.slug}`,
      children: extraPages.map(toNavChildItem),
    });
  }

  return items;
}

export function buildFooterNavigationFromPages(
  pages: PageDetail[],
  modules: EffectiveModuleFlags
): NavItem[] {
  const visible = pages.filter((page) => isPublicPageVisible(page, modules));
  if (visible.length === 0) {
    return getNavigationItems(modules);
  }

  return visible.map((page) => ({
    label: page.title,
    href: page.slug === "home" ? "/" : `/${page.slug}`,
  }));
}

export function resolveContactNavHref(
  pages: PageDetail[],
  modules: EffectiveModuleFlags
): string | null {
  if (!modules.contact) {
    return null;
  }
  const hasKontak = pages.some(
    (p) => p.slug === "kontak" && isPublicPageVisible(p, modules)
  );
  return hasKontak || pages.length === 0 ? "/kontak" : "/#contact";
}
