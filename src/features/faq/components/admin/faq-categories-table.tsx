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
import { FaqCategoryDialog } from "@/features/faq/components/admin/faq-category-dialog";
import { deleteFaqCategoryAction } from "@/features/faq/services/faq.actions";
import { queryKeys } from "@/lib/query-keys";
import type { FaqCategory } from "@/types/api.types";

interface FaqCategoriesTableProps {
  categories: FaqCategory[];
}

export function FaqCategoriesTable({
  categories,
}: FaqCategoriesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<FaqCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqCategory | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteFaqCategoryAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo<DataTableColumnDef<FaqCategory>[]>(
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
        header: "Nama Kategori FAQ",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900">
            {row.original.name}
          </span>
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
        id: "faqs_count",
        accessorFn: (row) => row.faqs_count ?? row.faqs?.length ?? 0,
        header: "Jumlah FAQ",
        cell: ({ row }) => (
          <Badge variant="info" className="tabular-nums">
            {row.original.faqs_count ?? row.original.faqs?.length ?? 0} item
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
        searchPlaceholder="Cari kategori FAQ..."
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
        emptyTitle="Belum ada kategori FAQ"
        emptyDescription="Tambahkan topik kategori agar daftar FAQ lebih terstruktur."
      />

      <FaqCategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selected}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Kategori FAQ?"
        description={`Kategori "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
