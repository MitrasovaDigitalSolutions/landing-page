"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateInquiryStatusAction } from "@/features/inquiry/services/inquiry.actions";
import type { InquiryItem } from "@/features/inquiry/types/inquiry.types";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface InquiryReplyValues {
  status: string;
  notes: string;
}

interface InquiryReplyDialogProps {
  inquiry: InquiryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  { value: "new", label: "Baru (New)" },
  { value: "contacted", label: "Sudah Dihubungi (Contacted)" },
  { value: "closed", label: "Selesai / Ditutup (Closed)" },
];

export function InquiryReplyDialog({
  inquiry,
  open,
  onOpenChange,
  onSuccess,
}: InquiryReplyDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const methods = useForm<InquiryReplyValues>({
    values: {
      status: inquiry?.status ?? "contacted",
      notes: inquiry?.notes ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: InquiryReplyValues) => {
      if (!inquiry) throw new Error("Inquiry tidak ditemukan.");
      return updateInquiryStatusAction(inquiry.id, values.status, values.notes);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal memperbarui status inquiry.");
    },
  });

  const cleanWa = inquiry?.phone.replace(/[^0-9]/g, "") ?? "";

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detail & Tindak Lanjut Pesan"
      description="Tinjau pesan pengirim dan perbarui status tindak lanjut."
      size="xl"
      headerRight={inquiry ? <StatusBadge status={inquiry.status} /> : undefined}
    >
      {inquiry ? (
        <div className="space-y-4">
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">
                {inquiry.name}
              </span>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3 text-slate-400" />
                  {inquiry.phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3 text-slate-400" />
                  {inquiry.email}
                </span>
              </div>
            </div>

            <div className="font-semibold text-slate-700">
              Subjek: {inquiry.subject ?? "Konsultasi Layanan"}
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-600">
              {inquiry.message}
            </p>
            {inquiry.attachment_url ? (
              <a
                href={inquiry.attachment_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary underline"
              >
                <span>Buka Berkas Lampiran</span>
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/${cleanWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-3.5" />
              <span>Hubungi Pengirim via WhatsApp</span>
            </a>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
              className="space-y-4 border-t border-slate-100 pt-4"
            >
              <FormInputOption<InquiryReplyValues>
                name="status"
                label="Status Penanganan"
                searchable={false}
                options={STATUS_OPTIONS}
              />

              <FormTextarea<InquiryReplyValues>
                name="notes"
                label="Catatan Internal Admin"
                placeholder="Catat hasil tindak lanjut atau kesepakatan konsultasi..."
                rows={3}
              />

              <FormDialogFooter
                onCancel={() => {
                  onOpenChange(false);
                }}
                cancelLabel="Tutup"
                submitLabel="Simpan Status & Catatan"
                isSubmitting={mutation.isPending}
              />
            </form>
          </FormProvider>
        </div>
      ) : null}
    </BaseDialog>
  );
}
