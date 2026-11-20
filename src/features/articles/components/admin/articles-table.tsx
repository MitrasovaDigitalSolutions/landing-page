"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Newspaper, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteArticleAction } from "@/features/articles/services/articles.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Article, ArticleCategory } from "@/types/api.types";
import { formatDateId } from "@/utils/format-date";
import { resolveMediaUrl } from "@/utils/media";

interface ArticlesTableProps {
  articles: Article[];
  categories: ArticleCategory[];
}

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Dipublikasikan" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Diarsipkan" },
];

function filterArticles(
  articles: Article[],
  search: string,
  statusFilter: string,
  categoryFilter: string
): Article[] {
  const q = search.trim().toLowerCase();
  return articles.filter((art) => {
    const currentStatus = art.status ?? "published";
    const matchesStatus =
      statusFilter === "all" || currentStatus === statusFilter;
    const matchesCat =
      categoryFilter === "all" ||
      String(art.article_category_id ?? "") === categoryFilter;
    const matchesQuery =
      !q ||
      art.title.toLowerCase().includes(q) ||
      (art.excerpt?.toLowerCase().includes(q) ?? false);
    return matchesStatus && matchesCat && matchesQuery;
  });
}

function buildArticleColumns(): DataTableColumnDef<Article>[] {
  return [
    {
      accessorKey: "title",
      header: "Artikel",
      cell: ({ row }) => {
        const item = row.original;
        const thumbUrl = resolveMediaUrl(
          item.thumbnail_url ?? item.thumbnail_path
        );
        return (
          <div className="flex max-w-md items-center gap-3">
            {thumbUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={thumbUrl}
                alt={item.title}
                className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Newspaper className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.title}
              </p>
              {item.excerpt ? (
                <p className="line-clamp-1 text-[11px] text-slate-500">
                  {item.excerpt}
                </p>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "Umum",
      header: "Kategori",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.category?.name ?? "Umum"}
        </Badge>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => row.status ?? "published",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status ?? "published"} />
      ),
    },
    {
      accessorKey: "published_at",
      header: "Tanggal Terbit",
      meta: { cellClassName: "whitespace-nowrap text-slate-500" },
      cell: ({ row }) => (
        <span>
          {row.original.published_at
            ? formatDateId(row.original.published_at)
            : "—"}
        </span>
      ),
    },
  ];
}

export function ArticlesTable({
  articles,
  categories,
}: ArticlesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteArticleAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Semua Kategori" },
      ...categories.map((c) => ({ value: String(c.id), label: c.name })),
    ],
    [categories]
  );

  const filteredArticles = useMemo(
    () => filterArticles(articles, search, statusFilter, categoryFilter),
    [articles, search, statusFilter, categoryFilter]
  );

  const columns = useMemo(() => buildArticleColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredArticles}
        getRowId={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul artikel..."
        filterContent={
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-40">
              <InputOption
                size="sm"
                searchable={false}
                value={statusFilter}
                options={STATUS_FILTER_OPTIONS}
                onValueChange={(val) => {
                  setStatusFilter(val || "all");
                }}
              />
            </div>
            <div className="w-44">
              <InputOption
                size="sm"
                searchable={categories.length > 5}
                value={categoryFilter}
                options={categoryOptions}
                onValueChange={(val) => {
                  setCategoryFilter(val || "all");
                }}
              />
            </div>
          </div>
        }
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              router.push("/admin/articles/create");
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tulis Artikel</span>
          </Button>
        }
        onEdit={(item) => {
          router.push(`/admin/articles/${item.id}/edit`);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada artikel"
        emptyDescription="Tulis artikel atau wawasan bisnis pertama Anda untuk ditampilkan ke publik."
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Artikel?"
        description={`Artikel "${deleteTarget?.title ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
