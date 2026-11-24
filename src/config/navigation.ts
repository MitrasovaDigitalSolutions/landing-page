import type { PageDetail } from "@/types/api.types";
import type { EffectiveModuleFlags } from "@/types/site.types";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

const ABOUT_GROUP_SLUGS = new Set(["profil", "cabang", "unit-usaha"]);
const RESERVED_CORE_SLUGS = new Set([
  "home",
  "profil",
  "cabang",
  "unit-usaha",
  "produk",
  "berita",
  "karir",
  "kontak",
]);

function isSlugAllowedByModules(
  slug: string,
  modules: EffectiveModuleFlags
): boolean {
  switch (slug) {
    case "cabang":
      return modules.branches;
    case "unit-usaha":
      return modules.businessUnits;
    case "produk":
      return modules.services;
    case "berita":
      return modules.articles;
    case "karir":
      return modules.careers;
    case "kontak":
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

  const beritaPage = visible.find((p) => p.slug === "berita");
  if (modules.articles && beritaPage) {
    items.push({ label: beritaPage.title || "Berita", href: "/berita" });
  }

  const karirPage = visible.find((p) => p.slug === "karir");
  if (modules.careers && karirPage) {
    items.push({ label: karirPage.title || "Karir", href: "/karir" });
  }

  const extraPages = visible.filter((p) => !RESERVED_CORE_SLUGS.has(p.slug));
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

export function resolveContactNavHref(pages: PageDetail[]): string {
  const hasKontak = pages.some(
    (p) => p.slug === "kontak" && isPublicPageVisible(p)
  );
  return hasKontak || pages.length === 0 ? "/kontak" : "/#contact";
}
