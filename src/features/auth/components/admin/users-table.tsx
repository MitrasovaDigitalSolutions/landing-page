"use client";

import { useMemo, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { DataTableActionButton } from "@/components/ui/data-table-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserFormDialog } from "@/features/auth/components/admin/user-form-dialog";
import { UserSiteAssignDialog } from "@/features/auth/components/admin/user-site-assign-dialog";
import type {
  ManagedSite,
  ManagedUser,
} from "@/features/auth/types/user-management.types";

interface UsersTableProps {
  initialData: ManagedUser[];
  sites: ManagedSite[];
}

function buildUserColumns(): DataTableColumnDef<ManagedUser>[] {
  return [
    {
      accessorKey: "name",
      header: "Pengguna Admin",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {item.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {item.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "level",
      accessorFn: (row) => (row.is_superadmin ? "Superadmin" : "Admin Site"),
      header: "Level Akses",
      cell: ({ row }) =>
        row.original.is_superadmin ? (
          <StatusBadge
            status="superadmin"
            label="Superadmin"
            showDot={false}
          />
        ) : (
          <StatusBadge status="admin" label="Admin Site" showDot={false} />
        ),
    },
    {
      id: "sites",
      header: "Unit Usaha Dipegang",
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        if (item.is_superadmin) {
          return (
            <Badge variant="purple" className="text-[11px]">
              Seluruh Unit Usaha
            </Badge>
          );
        }
        const assigned = item.sites ?? [];
        if (assigned.length === 0) {
          return (
            <span className="text-[11px] text-slate-400">
              Belum ada penugasan site
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1.5">
            {assigned.map((site) => (
              <Badge key={site.id} variant="secondary">
                {site.name} ({site.pivot?.role ?? site.role ?? "admin"})
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];
}

export function UsersTable({
  initialData,
  sites,
}: UsersTableProps): React.JSX.Element {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [assignUser, setAssignUser] = useState<ManagedUser | null>(null);

  const columns = useMemo(() => buildUserColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={initialData}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama atau email admin..."
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelectedUser(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Admin</span>
          </Button>
        }
        onEdit={(item) => {
          setSelectedUser(item);
          setFormOpen(true);
        }}
        renderActions={(item) => (
          <DataTableActionButton
            variant="primary"
            label="Atur Penugasan Site"
            icon={<Building2 className="h-4 w-4" />}
            onClick={() => {
              setAssignUser(item);
            }}
          />
        )}
        emptyTitle="Belum ada pengguna admin"
        emptyDescription="Tambahkan akun admin atau editor untuk mengelola unit usaha."
      />

      <UserFormDialog
        user={selectedUser}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <UserSiteAssignDialog
        user={assignUser}
        sites={sites}
        open={Boolean(assignUser)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAssignUser(null);
        }}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
