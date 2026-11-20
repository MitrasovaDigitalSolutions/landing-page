"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, ExternalLink, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { PartnerDialog } from "@/features/partners/components/admin/partner-dialog";
import { deletePartnerAction } from "@/features/partners/services/partners.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Partner } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface PartnersTableProps {
  partners: Partner[];
}

export function PartnersTable({
  partners,
}: PartnersTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deletePartnerAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.partners.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo<DataTableColumnDef<Partner>[]>(
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
        header: "Mitra / Partner",
        cell: ({ row }) => {
          const item = row.original;
          const logoUrl = resolveMediaUrl(item.logo_url ?? item.logo_path);
          return (
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                  <Building2 className="size-4" />
                </div>
              )}
              <span className="font-semibold text-slate-900">{item.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "website_url",
        header: "Website",
        cell: ({ row }) => {
          const url = row.original.website_url;
          if (!url) {
            return <span className="text-slate-400">—</span>;
          }
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
              <span className="max-w-xs truncate">{url}</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={partners}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama partner atau website..."
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
            <span>Tambah Partner</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada logo partner"
        emptyDescription="Tambahkan logo mitra atau klien yang bekerja sama dengan Anda."
      />

      <PartnerDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        partner={selected}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Partner?"
        description={`Mitra "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
