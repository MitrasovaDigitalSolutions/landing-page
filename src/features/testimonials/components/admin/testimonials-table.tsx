"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { TestimonialDialog } from "@/features/testimonials/components/admin/testimonial-dialog";
import { deleteTestimonialAction } from "@/features/testimonials/services/testimonials.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Testimonial } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface TestimonialsTableProps {
  testimonials: Testimonial[];
}

function buildTestimonialColumns(): DataTableColumnDef<Testimonial>[] {
  return [
    {
      accessorKey: "name",
      header: "Klien",
      cell: ({ row }) => {
        const item = row.original;
        const avatarUrl = resolveMediaUrl(item.avatar_url ?? item.avatar_path);
        return (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={item.name}
                className="size-9 shrink-0 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {item.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {item.title ?? "Klien"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Kutipan Ulasan",
      cell: ({ row }) => (
        <div className="max-w-sm">
          <p className="line-clamp-1 text-slate-600">
            &ldquo;{row.original.message}&rdquo;
          </p>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <Badge variant="warning" className="gap-1 tabular-nums">
          <Star className="size-3 fill-amber-500 text-amber-500" />
          <span>{row.original.rating}/5</span>
        </Badge>
      ),
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

export function TestimonialsTable({
  testimonials,
}: TestimonialsTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteTestimonialAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({
          queryKey: queryKeys.testimonials.all,
        });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const columns = useMemo(() => buildTestimonialColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={testimonials}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama klien atau ulasan..."
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
            <span>Tambah Testimoni</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        emptyTitle="Belum ada testimoni"
        emptyDescription="Tambahkan testimoni klien untuk meningkatkan kredibilitas layanan."
      />

      <TestimonialDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        testimonial={selected}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Testimoni?"
        description={`Testimoni dari "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
