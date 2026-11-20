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
import { InputOption } from "@/components/ui/input-option";
import { StatusBadge } from "@/components/ui/status-badge";
import { FaqDialog } from "@/features/faq/components/admin/faq-dialog";
import { deleteFaqAction } from "@/features/faq/services/faq.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Faq, FaqCategory } from "@/types/api.types";

interface FaqsTableProps {
  faqs: Faq[];
  categories: FaqCategory[];
}

function filterFaqs(
  faqs: Faq[],
  search: string,
  categoryFilter: string
): Faq[] {
  const q = search.trim().toLowerCase();
  return faqs.filter((item) => {
    const matchesCat =
      categoryFilter === "all" ||
      String(item.faq_category_id ?? "") === categoryFilter;
    const matchesQuery =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });
}

function buildFaqColumns(
  categories: FaqCategory[]
): DataTableColumnDef<Faq>[] {
  return [
    {
      accessorKey: "order",
      header: "Urutan",
      meta: { headerClassName: "w-24", cellClassName: "tabular-nums" },
      cell: ({ row }) => (
        <span className="font-semibold text-slate-600">
          #{row.original.order}
        </span>
      ),
    },
    {
      accessorKey: "question",
      header: "Pertanyaan & Jawaban",
      cell: ({ row }) => (
        <div className="max-w-lg space-y-0.5">
          <p className="line-clamp-1 font-semibold text-slate-900">
            {row.original.question}
          </p>
          <p className="line-clamp-1 text-[11px] text-slate-500">
            {row.original.answer}
          </p>
        </div>
      ),
    },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "Umum",
      header: "Kategori",
      cell: ({ row }) => {
        const catName =
          row.original.category?.name ??
          categories.find((c) => c.id === row.original.faq_category_id)?.name ??
          "Umum";
        return <Badge variant="secondary">{catName}</Badge>;
      },
    },
    {
      id: "status",
      accessorFn: (row) => (row.is_active !== false ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.is_active !== false ? "active" : "inactive"}
        />
      ),
    },
  ];
}

export function FaqsTable({
  faqs,
  categories,
}: FaqsTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Faq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteFaqAction(id),
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

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Semua Kategori" },
      ...categories.map((c) => ({ value: String(c.id), label: c.name })),
    ],
    [categories]
  );

  const filteredFaqs = useMemo(
    () => filterFaqs(faqs, search, categoryFilter),
    [faqs, search, categoryFilter]
  );

  const columns = useMemo(() => buildFaqColumns(categories), [categories]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredFaqs}
        getRowId={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari pertanyaan atau jawaban..."
        filterContent={
          <div className="w-full sm:w-52">
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
        }
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
            <span>Tambah FAQ</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada daftar FAQ"
        emptyDescription="Tambahkan pertanyaan yang sering diajukan beserta jawabannya."
      />

      <FaqDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        faq={selected}
        categories={categories}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Pertanyaan?"
        description={`FAQ "${deleteTarget?.question ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
