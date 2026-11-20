"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { StatusBadge } from "@/components/ui/status-badge";
import { PortfolioFormDialog } from "@/features/portfolio/components/admin/portfolio-form-dialog";
import { deletePortfolioAction } from "@/features/portfolio/services/portfolio.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Portfolio, ServiceType } from "@/types/api.types";
import { formatDateId } from "@/utils/format-date";
import { resolveMediaUrl } from "@/utils/media";

interface PortfoliosTableProps {
  portfolios: Portfolio[];
  types?: ServiceType[];
}

function filterPortfolios(
  portfolios: Portfolio[],
  search: string,
  typeFilter: string
): Portfolio[] {
  const q = search.trim().toLowerCase();
  return portfolios.filter((item) => {
    const matchesType =
      typeFilter === "all" || String(item.service_type_id ?? "") === typeFilter;
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.client_name?.toLowerCase().includes(q) ?? false);
    return matchesType && matchesQuery;
  });
}

function buildPortfolioColumns(
  types: ServiceType[]
): DataTableColumnDef<Portfolio>[] {
  return [
    {
      accessorKey: "title",
      header: "Proyek",
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
                <Briefcase className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {item.client_name ?? "Klien Internal"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "service_type",
      accessorFn: (row) => row.service_type?.name ?? "-",
      header: "Tipe Layanan",
      cell: ({ row }) => {
        const name =
          row.original.service_type?.name ??
          types.find((t) => t.id === row.original.service_type_id)?.name ??
          "—";
        return <Badge variant="secondary">{name}</Badge>;
      },
    },
    {
      accessorKey: "completion_date",
      header: "Selesai",
      meta: { cellClassName: "whitespace-nowrap text-slate-500" },
      cell: ({ row }) => (
        <span>
          {row.original.completion_date
            ? formatDateId(row.original.completion_date)
            : "—"}
        </span>
      ),
    },
    {
      id: "featured",
      accessorFn: (row) => (row.is_featured ? "featured" : "reguler"),
      header: "Prioritas",
      cell: ({ row }) =>
        row.original.is_featured ? (
          <StatusBadge status="featured" showDot={false} />
        ) : (
          <Badge variant="outline" className="text-slate-500">
            Reguler
          </Badge>
        ),
    },
  ];
}

export function PortfoliosTable({
  portfolios,
  types = [],
}: PortfoliosTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Portfolio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Portfolio | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deletePortfolioAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const typeOptions = useMemo(
    () => [
      { value: "all", label: "Semua Tipe Layanan" },
      ...types.map((t) => ({ value: String(t.id), label: t.name })),
    ],
    [types]
  );

  const filteredData = useMemo(
    () => filterPortfolios(portfolios, search, typeFilter),
    [portfolios, search, typeFilter]
  );

  const columns = useMemo(() => buildPortfolioColumns(types), [types]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredData}
        getRowId={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul proyek atau klien..."
        filterContent={
          types.length > 0 ? (
            <div className="w-full sm:w-52">
              <InputOption
                size="sm"
                searchable={types.length > 5}
                value={typeFilter}
                options={typeOptions}
                onValueChange={(val) => {
                  setTypeFilter(val || "all");
                }}
              />
            </div>
          ) : undefined
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
            <span>Tambah Portofolio</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada portofolio"
        emptyDescription="Tambahkan studi kasus atau hasil kerja sama klien terbaik Anda."
      />

      <PortfolioFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        portfolio={selected}
        types={types}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Portofolio?"
        description={`Portofolio "${deleteTarget?.title ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
