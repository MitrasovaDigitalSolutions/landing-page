"use client";

import { FormFileUpload } from "@/components/forms/form-file-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInquiryForm } from "@/features/inquiry/hooks/use-inquiry-form";
import type { InquiryFormData } from "@/features/inquiry/schemas/inquiry.schema";
import { Loader2, Send } from "lucide-react";
import { FormProvider } from "react-hook-form";

interface InquiryFormProps {
  defaultSubject?: string;
  compact?: boolean;
}

export function InquiryForm({
  defaultSubject,
  compact = false,
}: InquiryFormProps): React.JSX.Element {
  const { methods, isSubmitting, onSubmit } = useInquiryForm(defaultSubject);

  return (
    <Card
      className={
        compact
          ? "rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
          : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
      }
    >
      <div
        className={
          compact
            ? "mb-4 border-b border-slate-100 pb-3"
            : "mb-5 border-b border-slate-100 pb-4"
        }
      >
        <h3 className="text-lg font-bold text-slate-900">
          Formulir Pengajuan & Konsultasi
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Lengkapi data di bawah ini. Tim konsultan kami akan segera menghubungi
          Anda.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="space-y-4">
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
              placeholder="Contoh: Konsultasi Pinjaman Usaha"
            />
          </div>

          <FormTextarea<InquiryFormData>
            name="message"
            id="inquiry-message"
            label="Rincian Pesan / Pengajuan"
            placeholder="Tuliskan rincian kebutuhan, nominal, atau pertanyaan Anda..."
            rows={compact ? 3 : 4}
            required
          />

          <FormFileUpload<InquiryFormData>
            name="attachment"
            label="Lampiran Dokumen Pendukung (Opsional, Maks 10MB)"
          />

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="mt-2 h-11 w-full rounded-lg font-semibold"
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
        </form>
      </FormProvider>
    </Card>
  );
}
