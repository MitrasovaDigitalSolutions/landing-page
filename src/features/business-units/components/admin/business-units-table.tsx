"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Image as ImageIcon, Plus, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { BusinessUnitDialog } from "@/features/business-units/components/admin/business-unit-dialog";
import { deleteBusinessUnitAction } from "@/features/business-units/services/business-units.actions";
import { queryKeys } from "@/lib/query-keys";
import type { BusinessUnit } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface BusinessUnitsTableProps {
  units: BusinessUnit[];
}

function buildUnitColumns(): DataTableColumnDef<BusinessUnit>[] {
  return [
    {
      accessorKey: "name",
      header: "Unit Usaha",
      cell: ({ row }) => {
        const item = row.original;
        const thumb = resolveMediaUrl(item.image_url ?? item.image_path);
        return (
          <div className="flex max-w-md items-center gap-3">
            {thumb ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={thumb} alt={item.name} className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover" />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Store className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{item.name}</p>
              <p className="line-clamp-1 text-[11px] text-slate-500">
                {item.address ?? "Alamat belum diisi"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "url",
      header: "Website",
      cell: ({ row }) => {
        const url = row.original.url;
        if (!url) return <span className="text-slate-400">—</span>;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span className="max-w-48 truncate">{url}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        );
      },
    },
    {
      id: "gallery",
      accessorFn: (row) => row.image_urls?.length ?? 0,
      header: "Galeri",
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

export function BusinessUnitsTable({
  units,
}: BusinessUnitsTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<BusinessUnit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessUnit | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteBusinessUnitAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({
          queryKey: queryKeys.businessUnits.all,
        });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo(() => buildUnitColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={units}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama atau alamat unit usaha..."
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
            <span>Tambah Unit Usaha</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada unit usaha"
        emptyDescription="Tambahkan unit usaha grup agar tampil pada website."
      />

      <BusinessUnitDialog open={formOpen} onOpenChange={setFormOpen} unit={selected} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Unit Usaha?"
        description={`"${deleteTarget?.name ?? ""}" akan dihapus permanen beserta fotonya.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
