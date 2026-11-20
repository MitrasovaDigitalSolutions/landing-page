"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Globe, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { SiteFormDialog } from "@/features/auth/components/admin/site-form-dialog";
import { deleteSiteAction } from "@/features/auth/services/users.actions";
import type { ManagedSite } from "@/features/auth/types/user-management.types";
import { queryKeys } from "@/lib/query-keys";

interface SitesTableProps {
  sites: ManagedSite[];
}

function buildSiteColumns(): DataTableColumnDef<ManagedSite>[] {
  return [
    {
      accessorKey: "name",
      header: "Unit Usaha",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <code className="text-[11px] text-slate-500">/{item.slug}</code>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => {
        const domain = row.original.domain;
        if (!domain) {
          return <span className="text-slate-400">—</span>;
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-700">
            <Globe className="size-3.5 text-slate-400" />
            <span>{domain}</span>
          </span>
        );
      },
    },
    {
      id: "stats",
      header: "Ringkasan Data",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="info" className="tabular-nums">
            {row.original.users_count ?? 0} admin
          </Badge>
          <Badge variant="secondary" className="tabular-nums">
            {row.original.services_count ?? 0} layanan
          </Badge>
          <Badge variant="secondary" className="tabular-nums">
            {row.original.articles_count ?? 0} artikel
          </Badge>
        </div>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.is_active ? "active" : "inactive"}
        />
      ),
    },
  ];
}

export function SitesTable({ sites }: SitesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<ManagedSite | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedSite | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteSiteAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo(() => buildSiteColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={sites}
        getRowId={(row) => row.id}
        enableSearch
        searchPlaceholder="Cari nama, slug, atau domain unit usaha..."
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelectedSite(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Unit Usaha</span>
          </Button>
        }
        onEdit={(item) => {
          setSelectedSite(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada unit usaha"
        emptyDescription="Tambahkan unit usaha (tenant) baru untuk dikelola dari portal ini."
      />

      <SiteFormDialog
        site={selectedSite}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Unit Usaha?"
        description={`Unit usaha "${deleteTarget?.name ?? ""}" beserta datanya akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
