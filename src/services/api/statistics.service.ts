import { httpClient, type PaginatedResult } from "@/lib/http-client";
import type {
  Article,
  Faq,
  Partner,
  Portfolio,
  Service,
  Testimonial,
} from "@/types/api.types";
import { unwrapSettled } from "@/utils/promise";

export interface DashboardInquiryBrief {
  id: number;
  name: string;
  phone: string;
  subject: string | null;
  status: string;
  created_at: string;
}

export interface AdminStatistics {
  services_count: number;
  featured_services_count: number;
  portfolios_count: number;
  articles_count: number;
  published_articles_count: number;
  faqs_count: number;
  inquiries_count: number;
  unread_inquiries_count: number;
  testimonials_count: number;
  partners_count: number;
  recent_inquiries: DashboardInquiryBrief[];
}

const EMPTY_PAGE: PaginatedResult<never> = {
  data: [],
  meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
};

export async function getAdminStatistics(
  token: string,
  siteKey?: string
): Promise<AdminStatistics> {
  const options = { token, siteKey };

  const [
    servicesRes,
    portfoliosRes,
    articlesRes,
    faqsRes,
    inquiriesRes,
    testimonialsRes,
    partnersRes,
  ] = await Promise.allSettled([
    httpClient.getPaginated<Service>("/admin/services", options),
    httpClient.getPaginated<Portfolio>("/admin/portfolios", options),
    httpClient.getPaginated<Article>("/admin/articles", options),
    httpClient.get<Faq[]>("/admin/faqs", options),
    httpClient.getPaginated<DashboardInquiryBrief>("/admin/inquiries", options),
    httpClient.get<Testimonial[]>("/admin/testimonials", options),
    httpClient.get<Partner[]>("/admin/partners", options),
  ]);

  const services = unwrapSettled(servicesRes, EMPTY_PAGE);
  const portfolios = unwrapSettled(portfoliosRes, EMPTY_PAGE);
  const articles = unwrapSettled(articlesRes, EMPTY_PAGE);
  const faqs = unwrapSettled(faqsRes, []);
  const inquiries = unwrapSettled(inquiriesRes, EMPTY_PAGE);
  const testimonials = unwrapSettled(testimonialsRes, []);
  const partners = unwrapSettled(partnersRes, []);

  return {
    services_count: services.meta.total,
    featured_services_count: services.data.filter((s) => s.is_featured).length,
    portfolios_count: portfolios.meta.total,
    articles_count: articles.meta.total,
    published_articles_count: articles.data.filter(
      (a) => a.status === "published"
    ).length,
    faqs_count: Array.isArray(faqs) ? faqs.length : 0,
    inquiries_count: inquiries.meta.total,
    unread_inquiries_count: inquiries.data.filter((i) => i.status === "new")
      .length,
    testimonials_count: Array.isArray(testimonials) ? testimonials.length : 0,
    partners_count: Array.isArray(partners) ? partners.length : 0,
    recent_inquiries: inquiries.data.slice(0, 5),
  };
}
