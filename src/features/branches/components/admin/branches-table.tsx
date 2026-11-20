"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building, Image as ImageIcon, MapPin, Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { BranchDialog } from "@/features/branches/components/admin/branch-dialog";
import { deleteBranchAction } from "@/features/branches/services/branches.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Branch } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface BranchesTableProps {
  branches: Branch[];
}

function buildBranchColumns(): DataTableColumnDef<Branch>[] {
  return [
    {
      accessorKey: "name",
      header: "Kantor / Cabang",
      cell: ({ row }) => {
        const item = row.original;
        const thumb = resolveMediaUrl(item.image_urls?.[0] ?? item.images?.[0]);
        return (
          <div className="flex max-w-md items-center gap-3">
            {thumb ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={thumb} alt={item.name} className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover" />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Building className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{item.name}</p>
              <p className="flex items-center gap-1 truncate text-[11px] text-slate-500">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{item.address}</span>
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Telepon",
      cell: ({ row }) =>
        row.original.phone ? (
          <span className="inline-flex items-center gap-1.5 text-slate-700">
            <Phone className="size-3.5 text-slate-400" />
            {row.original.phone}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      id: "type",
      accessorFn: (row) => (row.is_primary ? "pusat" : "cabang"),
      header: "Jenis",
      cell: ({ row }) =>
        row.original.is_primary ? (
          <StatusBadge status="featured" label="Kantor Pusat" showDot={false} />
        ) : (
          <Badge variant="secondary">Cabang</Badge>
        ),
    },
    {
      id: "photos",
      accessorFn: (row) => row.image_urls?.length ?? 0,
      header: "Foto",
      cell: ({ row }) => (
        <Badge variant="info" className="gap-1 tabular-nums">
          <ImageIcon className="size-3" />
          {row.original.image_urls?.length ?? 0}
        </Badge>
      ),
    },
    {
      accessorKey: "order",
      header: "Urutan",
      meta: { headerClassName: "w-24", cellClassName: "tabular-nums" },
      cell: ({ row }) => (
        <span className="font-semibold text-slate-600">#{row.original.order}</span>
      ),
    },
  ];
}

export function BranchesTable({ branches }: BranchesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteBranchAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo(() => buildBranchColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={branches}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama, alamat, atau telepon..."
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
            <span>Tambah Cabang</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada kantor atau cabang"
        emptyDescription="Tambahkan kantor pusat dan cabang agar calon klien mudah menemukan lokasi Anda."
      />

      <BranchDialog open={formOpen} onOpenChange={setFormOpen} branch={selected} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Kantor / Cabang?"
        description={`"${deleteTarget?.name ?? ""}" akan dihapus permanen beserta fotonya.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
