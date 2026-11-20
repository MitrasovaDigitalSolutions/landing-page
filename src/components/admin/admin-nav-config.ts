
import {
  LayoutDashboard,
  Inbox,
  Layers,
  FileText,
  HelpCircle,
  Star,
  Briefcase,
  FolderKanban,
  Building,
  Store,
  Settings,
  Network,
  type LucideIcon,
} from "lucide-react";

// Navigation types
export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  key: string;
  label: string | null;
  items: AdminNavItem[];
}

// Navigation items
const NAV_ITEMS = {
  dashboard: {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  inquiries: {
    label: "Pesan Masuk",
    href: "/admin/inquiries",
    icon: Inbox,
  },

  // Website
  pages: {
    label: "Halaman",
    href: "/admin/pages",
    icon: Layers,
  },
  articles: {
    label: "Artikel & Berita",
    href: "/admin/articles",
    icon: FileText,
  },
  faqs: {
    label: "FAQ",
    href: "/admin/faqs",
    icon: HelpCircle,
  },
  showcase: {
    label: "Testimoni & Mitra",
    href: "/admin/showcase",
    icon: Star,
  },

  // Business
  services: {
    label: "Produk & Layanan",
    href: "/admin/services",
    icon: Briefcase,
  },
  portfolios: {
    label: "Portfolio",
    href: "/admin/portfolios",
    icon: FolderKanban,
  },

  // Organization
  branches: {
    label: "Kantor & Cabang",
    href: "/admin/branches",
    icon: Building,
  },
  businessUnits: {
    label: "Unit Usaha",
    href: "/admin/business-units",
    icon: Store,
  },

  // Settings
  settings: {
    label: "Pengaturan Situs",
    href: "/admin/settings",
    icon: Settings,
  },
  users: {
    label: "Situs & Pengguna",
    href: "/admin/users",
    icon: Network,
  },
} satisfies Record<string, AdminNavItem>;

// Base navigation groups
const NAV_GROUPS: AdminNavGroup[] = [
  {
    key: "main",
    label: null,
    items: [
      NAV_ITEMS.dashboard,
      NAV_ITEMS.inquiries,
    ],
  },
  {
    key: "website",
    label: "Website",
    items: [
      NAV_ITEMS.pages,
      NAV_ITEMS.articles,
      NAV_ITEMS.faqs,
      NAV_ITEMS.showcase,
    ],
  },
  {
    key: "business",
    label: "Business",
    items: [
      NAV_ITEMS.services,
      NAV_ITEMS.portfolios,
    ],
  },
  {
    key: "organization",
    label: "Organization",
    items: [
      NAV_ITEMS.branches,
      NAV_ITEMS.businessUnits,
    ],
  },
];

// Build navigation based on user role
export function getAdminNavGroups(
  isSuperadmin: boolean
): AdminNavGroup[] {
  const settingsItems: AdminNavItem[] = [
    NAV_ITEMS.settings,
    ...(isSuperadmin ? [NAV_ITEMS.users] : []),
  ];

  return [
    ...NAV_GROUPS,
    {
      key: "settings",
      label: "Settings",
      items: settingsItems,
    },
  ];
}

// Check whether a navigation item matches the current route
export function isNavItemActive(
  pathname: string,
  href: string
): boolean {
  const normalizePath = (path: string): string =>
    path.replace(/\/+$/, "") || "/";

  const currentPath = normalizePath(pathname);
  const targetPath = normalizePath(href);

  // Dashboard should only match the admin root
  if (targetPath === "/admin") {
    return currentPath === targetPath;
  }

  // Match exact route and nested routes
  return (
    currentPath === targetPath ||
    currentPath.startsWith(`${targetPath}/`)
  );
}
