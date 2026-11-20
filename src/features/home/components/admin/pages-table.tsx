"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActionButton } from "@/components/ui/data-table-actions";
import { InputOption, type OptionItem } from "@/components/ui/input-option";
import { PageFormDialog } from "@/features/home/components/admin/page-form-dialog";
import {
  buildPageColumns,
  isPagePublished,
} from "@/features/home/components/admin/pages-table-columns";
import { deletePageAction } from "@/features/home/services/pages.actions";
import { queryKeys } from "@/lib/query-keys";
import type { PageDetail } from "@/types/api.types";

interface PagesTableProps {
  initialData: PageDetail[];
}

const STATUS_FILTER_OPTIONS: OptionItem[] = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export function PagesTable({ initialData }: PagesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PageDetail | null>(null);

  const filteredPages = useMemo(() => {
    if (statusFilter === "all") {
      return initialData;
    }
    return initialData.filter((page) => {
      const published = isPagePublished(page);
      return statusFilter === "published" ? published : !published;
    });
  }, [initialData, statusFilter]);

  const deleteMutation = useMutation({
    mutationFn: async (target: PageDetail) =>
      deletePageAction(target.id, target.slug),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.pages.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo(
    () =>
      buildPageColumns((page) => {
        router.push(`/admin/pages/${page.id}`);
      }),
    [router]
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredPages}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari judul halaman, slug, atau SEO..."
        onRowClick={(row) => {
          router.push(`/admin/pages/${row.id}`);
        }}
        filterContent={
          <div className="w-40">
            <InputOption
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
              searchable={false}
              size="sm"
            />
          </div>
        }
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelectedPage(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Halaman</span>
          </Button>
        }
        renderActions={(row) => (
          <div className="inline-flex items-center gap-0.5">
            <DataTableActionButton
              icon={<Layers className="size-4" />}
              label="Kelola Section"
              variant="primary"
              onClick={() => {
                router.push(`/admin/pages/${row.id}`);
              }}
            />
            <DataTableActionButton
              icon={<Pencil className="size-4" />}
              label="Edit Halaman"
              variant="edit"
              onClick={() => {
                setSelectedPage(row);
                setFormOpen(true);
              }}
            />
            <DataTableActionButton
              icon={<Trash2 className="size-4" />}
              label={
                row.slug === "home"
                  ? "Beranda utama tidak dapat dihapus"
                  : "Hapus Halaman"
              }
              variant="delete"
              disabled={row.slug === "home"}
              onClick={() => {
                setDeleteTarget(row);
              }}
            />
          </div>
        )}
        emptyTitle="Belum ada halaman"
        emptyDescription="Tambahkan halaman baru untuk mulai mengelola section dan SEO situs Anda."
      />

      <PageFormDialog
        page={selectedPage}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteTarget(null);
          }
        }}
        title="Hapus Halaman?"
        description={`Halaman "${deleteTarget?.title ?? ""}" (/${deleteTarget?.slug ?? ""}) beserta seluruh section-nya akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget);
          }
        }}
      />
    </div>
  );
}
