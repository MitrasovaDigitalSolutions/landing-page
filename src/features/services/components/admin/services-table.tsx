"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { StatusBadge } from "@/components/ui/status-badge";
import { ServiceFormDialog } from "@/features/services/components/admin/service-form-dialog";
import { deleteServiceAction } from "@/features/services/services/services.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Service, ServiceType } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface ServicesTableProps {
  services: Service[];
  types: ServiceType[];
}

function filterServices(
  services: Service[],
  search: string,
  typeFilter: string
): Service[] {
  const q = search.trim().toLowerCase();
  return services.filter((srv) => {
    const matchesType =
      typeFilter === "all" || String(srv.service_type_id) === typeFilter;
    const matchesQuery =
      !q ||
      srv.name.toLowerCase().includes(q) ||
      srv.short_desc.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });
}

function buildServiceColumns(
  types: ServiceType[]
): DataTableColumnDef<Service>[] {
  return [
    {
      accessorKey: "name",
      header: "Layanan",
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
                alt={item.name}
                className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Layers className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="line-clamp-1 text-[11px] text-slate-500">
                {item.short_desc}
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
        const typeName =
          row.original.service_type?.name ??
          types.find((t) => t.id === row.original.service_type_id)?.name ??
          "—";
        return <Badge variant="secondary">{typeName}</Badge>;
      },
    },
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
      id: "status",
      accessorFn: (row) => (row.is_active !== false ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge
            status={row.original.is_active !== false ? "active" : "inactive"}
          />
          {row.original.is_featured ? (
            <StatusBadge status="featured" showDot={false} />
          ) : null}
        </div>
      ),
    },
  ];
}

export function ServicesTable({
  services,
  types,
}: ServicesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteServiceAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const typeFilterOptions = useMemo(
    () => [
      { value: "all", label: "Semua Tipe Layanan" },
      ...types.map((t) => ({ value: String(t.id), label: t.name })),
    ],
    [types]
  );

  const filteredServices = useMemo(
    () => filterServices(services, search, typeFilter),
    [services, search, typeFilter]
  );

  const columns = useMemo(() => buildServiceColumns(types), [types]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredServices}
        getRowId={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama atau ringkasan layanan..."
        filterContent={
          <div className="w-full sm:w-52">
            <InputOption
              size="sm"
              searchable={types.length > 5}
              value={typeFilter}
              options={typeFilterOptions}
              onValueChange={(val) => {
                setTypeFilter(val || "all");
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
            <span>Tambah Layanan</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada data layanan"
        emptyDescription="Tambahkan layanan pertama untuk ditampilkan ke calon klien."
      />

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        service={selected}
        types={types}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Layanan?"
        description={`Layanan "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
