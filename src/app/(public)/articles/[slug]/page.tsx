import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { SmartImage } from "@/components/shared/smart-image";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { ArticleCard } from "@/features/articles/components/article-card";
import {
  getArticleBySlug,
  getArticles,
} from "@/features/articles/services/articles.queries";
import {
  buildPageMetadata,
  resolveSiteUrl,
  toAbsoluteSiteUrl,
} from "@/lib/seo";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo-jsonld";
import { getSiteSettings } from "@/services/api/settings.service";
import { formatDateId } from "@/utils/format-date";
import { resolveMediaUrl } from "@/utils/media";
import { sanitizeArticleHtml } from "@/utils/sanitize-html";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug, siteKey),
    getSiteSettings(siteKey),
  ]);

  const title = article?.title ?? "Artikel & Berita";
  const imagePathOrUrl = article
    ? resolveMediaUrl(article.thumbnail_url, article.thumbnail_path)
    : null;

  return buildPageMetadata({
    title,
    description: article?.excerpt,
    path: `/articles/${slug}`,
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
    imagePathOrUrl,
    type: "article",
    publishedTime: article?.published_at,
  });
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const [article, allArticles, settings] = await Promise.all([
    getArticleBySlug(slug, siteKey).catch(() => null),
    getArticles(undefined, siteKey).catch(() => []),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );

  if (!effectiveModules.articles || !article) {
    notFound();
  }

  const relatedArticles = allArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const hasImage = Boolean(
    resolveMediaUrl(article.thumbnail_url, article.thumbnail_path)
  );
  const dateText = formatDateId(article.published_at);
  const authorName = article.author?.name ?? "Tim Redaksi";
  const siteUrl = resolveSiteUrl(settings);
  const publisherName =
    settings.general?.site_title ?? resolveSiteConfig(siteKey).name;
  const publisherLogo = toAbsoluteSiteUrl(
    resolveMediaUrl(settings.general?.logo_url, settings.general?.logo_path),
    siteUrl
  );
  const structuredData = [
    buildArticleJsonLd({ article, siteUrl, publisherName, publisherLogo }),
    buildBreadcrumbJsonLd(
      [
        { name: "Beranda", path: "/" },
        { name: "Berita", path: "/berita" },
        { name: article.title, path: `/articles/${article.slug}` },
      ],
      siteUrl
    ),
  ];

  return (
    <div>
      <JsonLd data={structuredData} />
      <article className="border-b border-slate-200 bg-white py-14 md:py-20">
        <Container size="narrow">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Artikel & Berita</span>
          </Link>

          <div className="mt-6">
            {article.category ? (
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                {article.category.name}
              </span>
            ) : null}

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="mt-5 border-b border-slate-200 pb-6 text-xs font-semibold text-slate-500">
              {dateText ? `${dateText} • ` : ""}Oleh {authorName}
            </p>
          </div>

          {hasImage ? (
            <div className="relative mt-8 aspect-16/9 w-full overflow-hidden rounded-2xl border border-slate-200 bg-sky-50">
              <SmartImage
                src={article.thumbnail_url}
                fallbackPath={article.thumbnail_path}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          ) : null}

          {article.excerpt ? (
            <p className="mt-8 rounded-r-xl border-l-4 border-primary bg-primary/5 p-4 text-base font-medium leading-relaxed text-slate-700">
              {article.excerpt}
            </p>
          ) : null}

          <div
            className="rich-content mt-8"
            dangerouslySetInnerHTML={{
              __html: sanitizeArticleHtml(article.body),
            }}
          />
        </Container>
      </article>

      {relatedArticles.length > 0 ? (
        <section className="bg-slate-50 py-14 md:py-20">
          <Container>
            <h2 className="mb-8 text-2xl font-bold text-slate-900">
              Artikel & Publikasi Lainnya
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedArticles.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
