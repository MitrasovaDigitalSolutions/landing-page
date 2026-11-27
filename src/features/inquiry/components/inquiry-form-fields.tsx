"use client";

import { Loader2, MessageCircle, Send } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormWhatsappInput } from "@/components/forms/form-whatsapp-input";
import { Button } from "@/components/ui/button";
import { InquiryBranchSelect } from "@/features/inquiry/components/inquiry-branch-select";
import type { InquiryFormData } from "@/features/inquiry/schemas/inquiry.schema";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/api.types";

interface InquiryFormFieldsProps {
  compact: boolean;
  isSubmitting: boolean;
  alignSubmitEnd?: boolean;
  branches?: Branch[];
  fallbackWhatsapp?: string | null;
  hasWhatsappTarget?: boolean;
  lastWhatsappUrl?: string | null;
}

export function InquiryFormFields({
  compact,
  isSubmitting,
  alignSubmitEnd = false,
  branches = [],
  fallbackWhatsapp,
  hasWhatsappTarget = false,
  lastWhatsappUrl = null,
}: InquiryFormFieldsProps): React.JSX.Element {
  let submitLabel = hasWhatsappTarget
    ? "Kirim & Lanjut ke WhatsApp"
    : "Kirim Permohonan Konsultasi";
  let submitIcon = hasWhatsappTarget ? (
    <MessageCircle className="size-4" />
  ) : (
    <Send className="size-4" />
  );

  if (isSubmitting) {
    submitLabel = "Mengirim Permohonan...";
    submitIcon = <Loader2 className="size-4 animate-spin" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput<InquiryFormData>
          name="name"
          label="Nama Lengkap"
          placeholder="Contoh: Ahmad Dani"
          required
        />
        <FormWhatsappInput<InquiryFormData>
          name="phone"
          id="inquiry-phone"
          label="Nomor WhatsApp / Telepon"
          placeholder="81234567890"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput<InquiryFormData>
          name="email"
          type="email"
          label="Alamat Email (Opsional)"
          placeholder="ahmad@example.com"
        />
        <FormInput<InquiryFormData>
          name="subject"
          label="Subjek / Kebutuhan Layanan"
          placeholder="Contoh: Konsultasi & Pemesanan Produk"
        />
      </div>

      {branches.length > 0 ? (
        <InquiryBranchSelect
          branches={branches}
          fallbackWhatsapp={fallbackWhatsapp}
        />
      ) : null}

      <FormTextarea<InquiryFormData>
        name="message"
        id="inquiry-message"
        label="Rincian Pesan / Pengajuan"
        placeholder="Tuliskan rincian kebutuhan, jumlah, atau pertanyaan Anda..."
        rows={compact ? 3 : 4}
        required
      />

      {lastWhatsappUrl ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 text-xs text-emerald-800">
          <p className="font-medium">
            Pesan tersimpan. Jika WhatsApp belum terbuka otomatis, lanjutkan lewat tombol di samping.
          </p>
          <a
            href={lastWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white transition-colors hover:bg-emerald-700"
          >
            Buka WhatsApp ↗
          </a>
        </div>
      ) : null}

      <div className={cn(alignSubmitEnd && "flex justify-end pt-1")}>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className={cn(
            "mt-1 h-11 rounded-lg font-semibold",
            alignSubmitEnd ? "w-full sm:w-auto sm:px-6" : "mt-2 w-full"
          )}
        >
          {submitIcon}
          <span>{submitLabel}</span>
        </Button>
      </div>
    </div>
  );
}
