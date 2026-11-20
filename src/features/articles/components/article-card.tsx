import { SmartImage } from "@/components/shared/smart-image";
import { Card } from "@/components/ui/card";
import type { Article } from "@/types/api.types";
import { formatDateId } from "@/utils/format-date";
import { ArrowUpRight, Calendar, Newspaper, User } from "lucide-react";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps): React.JSX.Element {
  const coverFallback = (
    <div className="flex size-full flex-col justify-between bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-6 text-white">
      <div className="flex items-center justify-between">
        <Newspaper className="size-5 text-white/80" />
        <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">
          Publikasi Resmi
        </span>
      </div>
      <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
        {article.title}
      </p>
    </div>
  );

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-md hover:shadow-primary/[0.08] hover:ring-1 hover:ring-primary/20">
      <div>
        <div className="relative aspect-16/9 w-full overflow-hidden border-b border-slate-100 bg-primary/10">
          <SmartImage
            src={article.thumbnail_url}
            fallbackPath={article.thumbnail_path}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fallbackClassName="bg-primary/10"
            fallback={coverFallback}
          />
          {article.category ? (
            <span className="absolute top-3 left-3 rounded-lg border border-white/80 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary uppercase shadow-xs">
              {article.category.name}
            </span>
          ) : null}
        </div>

        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
            {article.published_at ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                {formatDateId(article.published_at)}
              </span>
            ) : null}
            {article.author?.name ? (
              <span className="inline-flex items-center gap-1">
                <User className="size-3 text-slate-400" />
                {article.author.name}
              </span>
            ) : null}
          </div>

          <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>

          {article.excerpt ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {article.excerpt}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3.5">
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span>Baca Artikel Lengkap</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
