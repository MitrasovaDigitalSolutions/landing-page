"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable, type DataTableColumnDef } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { StatusBadge } from "@/components/ui/status-badge";
import { InquiryReplyDialog } from "@/features/inquiry/components/admin/inquiry-reply-dialog";
import { deleteInquiryAction } from "@/features/inquiry/services/inquiry.actions";
import type { InquiryItem } from "@/features/inquiry/types/inquiry.types";
import { queryKeys } from "@/lib/query-keys";
import { formatDateId } from "@/utils/format-date";

interface InquiriesTableProps {
  initialData: InquiryItem[];
}

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "closed", label: "Selesai" },
];

function filterInquiries(
  initialData: InquiryItem[],
  search: string,
  statusFilter: string
): InquiryItem[] {
  const q = search.trim().toLowerCase();
  return initialData.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      (item.email?.toLowerCase().includes(q) ?? false) ||
      (item.subject?.toLowerCase().includes(q) ?? false) ||
      item.message.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });
}

function buildInquiryColumns(): DataTableColumnDef<InquiryItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Pengirim",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-900">{item.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3" />
                {item.phone}
              </span>
              {item.email ? (
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3" />
                  {item.email}
                </span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Subjek & Pesan",
      cell: ({ row }) => (
        <div className="max-w-md space-y-0.5">
          <p className="truncate font-semibold text-slate-800">
            {row.original.subject ?? "Konsultasi Layanan"}
          </p>
          <p className="line-clamp-1 text-[11px] text-slate-500">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Masuk",
      meta: { cellClassName: "whitespace-nowrap text-slate-500" },
      cell: ({ row }) => <span>{formatDateId(row.original.created_at)}</span>,
    },
  ];
}

export function InquiriesTable({
  initialData,
}: InquiriesTableProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<InquiryItem | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InquiryItem | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteInquiryAction(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all });
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const filteredData = useMemo(
    () => filterInquiries(initialData, search, statusFilter),
    [initialData, search, statusFilter]
  );

  const columns = useMemo(() => buildInquiryColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredData}
        getRowId={(row) => String(row.id)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari pengirim, subjek, atau pesan..."
        filterContent={
          <div className="w-full sm:w-44">
            <InputOption
              size="sm"
              searchable={false}
              value={statusFilter}
              options={STATUS_FILTER_OPTIONS}
              onValueChange={(val) => {
                setStatusFilter(val || "all");
              }}
            />
          </div>
        }
        onView={(item) => {
          setSelected(item);
          setReplyOpen(true);
        }}
        onDelete={(item) => {
          setDeleteTarget(item);
        }}
        onRowClick={(item) => {
          setSelected(item);
          setReplyOpen(true);
        }}
        emptyTitle="Kotak masuk masih kosong"
        emptyDescription="Pesan konsultasi dari pengunjung website akan muncul di sini."
      />

      <InquiryReplyDialog
        inquiry={selected}
        open={replyOpen}
        onOpenChange={setReplyOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Pesan Masuk?"
        description={`Pesan dari "${deleteTarget?.name ?? ""}" akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
