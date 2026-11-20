"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { ArticleCategoryDialog } from "@/features/articles/components/admin/article-category-dialog";
import { deleteArticleCategoryAction } from "@/features/articles/services/articles.actions";
import { queryKeys } from "@/lib/query-keys";
import type { ArticleCategory } from "@/types/api.types";

interface ArticleCategoriesTableProps {
  categories: ArticleCategory[];
}

export function ArticleCategoriesTable({
  categories,
}: ArticleCategoriesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ArticleCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArticleCategory | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteArticleCategoryAction(id),
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

  const columns = useMemo<DataTableColumnDef<ArticleCategory>[]>(
    () => [
      {
        id: "order",
        accessorFn: (row) => row.order ?? 1,
        header: "Urutan",
        meta: { headerClassName: "w-24", cellClassName: "tabular-nums" },
        cell: ({ row }) => (
          <span className="font-semibold text-slate-600">
            #{row.original.order ?? 1}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Nama Kategori",
        cell: ({ row }) => (
          <div className="max-w-md">
            <p className="font-semibold text-slate-900">{row.original.name}</p>
            {row.original.description ? (
              <p className="line-clamp-1 text-[11px] text-slate-500">
                {row.original.description}
              </p>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <code className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
            {row.original.slug}
          </code>
        ),
      },
      {
        id: "articles_count",
        accessorFn: (row) => row.articles_count ?? 0,
        header: "Artikel",
        cell: ({ row }) => (
          <Badge variant="info" className="tabular-nums">
            {row.original.articles_count ?? 0} artikel
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={categories}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari kategori artikel..."
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelected(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Kategori</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada kategori artikel"
        emptyDescription="Tambahkan kategori untuk mengelompokkan artikel berita."
      />

      <ArticleCategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selected}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Kategori Artikel?"
        description={`Kategori "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
