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
import { ServiceTypeDialog } from "@/features/services/components/admin/service-type-dialog";
import { deleteServiceTypeAction } from "@/features/services/services/services.actions";
import { queryKeys } from "@/lib/query-keys";
import type { ServiceType } from "@/types/api.types";

interface ServiceTypesTableProps {
  types: ServiceType[];
}

export function ServiceTypesTable({
  types,
}: ServiceTypesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ServiceType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceType | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteServiceTypeAction(id),
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

  const columns = useMemo<DataTableColumnDef<ServiceType>[]>(
    () => [
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
        accessorKey: "name",
        header: "Nama Tipe Layanan",
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
        id: "services_count",
        accessorFn: (row) => row.services_count ?? 0,
        header: "Layanan Terhubung",
        cell: ({ row }) => (
          <Badge variant="info" className="tabular-nums">
            {row.original.services_count ?? 0} layanan
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
        data={types}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari tipe layanan..."
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
            <span>Tambah Tipe</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada tipe layanan"
        emptyDescription="Buat kategori tipe layanan untuk mengorganisir daftar produk Anda."
      />

      <ServiceTypeDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        serviceType={selected}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Tipe Layanan?"
        description={`Tipe layanan "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
