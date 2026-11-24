"use client";

import { FormFileUpload } from "@/components/forms/form-file-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import type { InquiryFormData } from "@/features/inquiry/schemas/inquiry.schema";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";

interface InquiryFormFieldsProps {
  compact: boolean;
  isSubmitting: boolean;
  alignSubmitEnd?: boolean;
}

export function InquiryFormFields({
  compact,
  isSubmitting,
  alignSubmitEnd = false,
}: InquiryFormFieldsProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput<InquiryFormData>
          name="name"
          label="Nama Lengkap"
          placeholder="Contoh: Ahmad Dani"
          required
        />
        <FormInput<InquiryFormData>
          name="phone"
          id="inquiry-phone"
          label="Nomor Telepon / WhatsApp"
          placeholder="081234567890"
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

      <FormTextarea<InquiryFormData>
        name="message"
        id="inquiry-message"
        label="Rincian Pesan / Pengajuan"
        placeholder="Tuliskan rincian kebutuhan, jumlah, atau pertanyaan Anda..."
        rows={compact ? 3 : 4}
        required
      />

      <FormFileUpload<InquiryFormData>
        name="attachment"
        label="Lampiran Dokumen Pendukung (Opsional, Maks 10MB)"
      />

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
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          <span>
            {isSubmitting
              ? "Mengirim Permohonan..."
              : "Kirim Permohonan Konsultasi"}
          </span>
        </Button>
      </div>
    </div>
  );
}
