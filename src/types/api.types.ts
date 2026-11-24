import type { PageSection } from "@/types/page-section.types";

export type * from "@/types/page-section.types";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PageDetail {
  id: number;
  site_id?: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_desc: string | null;
  is_published?: boolean;
  is_active?: boolean;
  sections_count?: number;
  sections?: PageSection[];
}

export interface ServiceType {
  id: number;
  site_id?: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  icon_url?: string | null;
  order: number;
  services_count?: number;
}

export interface Service {
  id: number;
  site_id?: string;
  service_type_id: number;
  name: string;
  slug: string;
  short_desc: string;
  body: string | null;
  icon_path?: string | null;
  thumbnail_path?: string | null;
  icon_url: string | null;
  thumbnail_url: string | null;
  features: string[] | null;
  price?: number | null;
  price_note?: string | null;
  is_featured: boolean;
  is_active?: boolean;
  order: number;
  service_type?: ServiceType;
}

export interface Portfolio {
  id: number;
  site_id?: string;
  service_type_id: number | null;
  title: string;
  slug: string;
  client_name: string | null;
  completion_date: string | null;
  description: string | null;
  thumbnail_path?: string | null;
  thumbnail_url: string | null;
  gallery_images: string[] | null;
  gallery_image_urls?: string[] | null;
  is_featured: boolean;
  order: number;
  service_type?: ServiceType | null;
}

export interface ArticleCategory {
  id: number;
  site_id?: string;
  name: string;
  slug: string;
  description: string | null;
  order?: number;
  articles_count?: number;
}

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: number;
  site_id?: string;
  article_category_id: number | null;
  author_id?: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  thumbnail_path?: string | null;
  thumbnail_url: string | null;
  status?: ArticleStatus;
  published_at: string | null;
  category?: ArticleCategory | null;
  author?: { id: number; name: string } | null;
}

export interface FaqCategory {
  id: number;
  site_id?: string;
  name: string;
  slug: string;
  order?: number;
  faqs_count?: number;
  faqs?: (Faq | string)[];
}

export interface Faq {
  id: number;
  site_id?: string;
  faq_category_id: number | null;
  question: string;
  answer: string;
  order: number;
  is_active?: boolean;
  category?: FaqCategory | null;
}

export type FaqRawItem = Faq | FaqCategory;

export interface Testimonial {
  id: number;
  site_id?: string;
  name: string;
  title: string | null;
  avatar_path?: string | null;
  avatar_url: string | null;
  message: string;
  rating: number;
  order: number;
  is_active?: boolean;
}

export interface Partner {
  id: number;
  site_id?: string;
  name: string;
  logo_path?: string | null;
  logo_url: string | null;
  website_url: string | null;
  order: number;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data?: unknown;
}


export interface Branch {
  id: number;
  site_id?: string;
  name: string;
  address: string;
  phone: string | null;
  is_primary: boolean;
  images: string[] | null;
  image_urls: string[] | null;
  order: number;
}

export interface BusinessUnit {
  id: number;
  site_id?: string;
  name: string;
  address: string | null;
  image_path?: string | null;
  image_url: string | null;
  images: string[] | null;
  image_urls: string[] | null;
  url: string | null;
  order: number;
}
