export interface PageSectionCta {
  text: string;
  url: string;
}

export interface PageSectionStat {
  label: string;
  value: string;
}

export interface PageSectionSlide {
  title: string;
  description?: string | null;
  badge?: string | null;
  image_path?: string | null;
  image_url?: string | null;
}

export interface PageSectionFeaturedCard {
  title: string;
  description?: string | null;
  products?: string[];
  note?: string | null;
}

export interface PageSectionMisiItem {
  title: string;
  desc: string;
}

export interface PageSectionListItem {
  title: string;
  desc1?: string;
  desc2?: string;
  description?: string;
}

export interface PageSectionOpening {
  title: string;
  location?: string;
  type?: string;
  description?: string;
  deadline?: string;
}

export interface PageSectionPayload {
  badge?: string;
  cta_text?: string;
  cta_url?: string;
  cta_primary?: PageSectionCta;
  cta_secondary?: PageSectionCta;
  button_text?: string;
  button_link?: string;
  button_label?: string;
  button_url?: string;
  cta_label?: string;
  limit?: number;
  maps_embed?: string;
  image_path?: string;
  image_url?: string;
  image_label?: string;
  image_caption?: string;
  visi?: string;
  misi?: PageSectionMisiItem[];
  items?: PageSectionListItem[];
  openings?: PageSectionOpening[];
  handle?: string;
  profile_url?: string;
  posts?: string[];
  slides?: PageSectionSlide[];
  cards?: PageSectionFeaturedCard[];
  stats?: PageSectionStat[];
  [key: string]: unknown;
}

export interface PageSection {
  id: number;
  page_id?: number;
  key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  payload: PageSectionPayload | null;
  image_url: string | null;
  image_path?: string | null;
  is_active?: boolean;
  order: number;
}
