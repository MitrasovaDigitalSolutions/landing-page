"use client";

import { Card } from "@/components/ui/card";
import { InquiryFormFields } from "@/features/inquiry/components/inquiry-form-fields";
import { InquiryFormInfoPanel } from "@/features/inquiry/components/inquiry-form-info-panel";
import { useInquiryForm } from "@/features/inquiry/hooks/use-inquiry-form";
import { FormProvider } from "react-hook-form";

export interface InquiryFormProps {
  defaultSubject?: string;
  compact?: boolean;
  orientation?: "vertical" | "horizontal";
  title?: string;
  description?: string;
  whatsappUrl?: string | null;
  whatsappLabel?: string;
}

export function InquiryForm({
  defaultSubject,
  compact = false,
  orientation = "vertical",
  title = "Formulir Pengajuan & Konsultasi",
  description = "Lengkapi data di bawah ini. Tim konsultan kami akan segera menghubungi Anda.",
  whatsappUrl,
  whatsappLabel = "Chat via WhatsApp",
}: InquiryFormProps): React.JSX.Element {
  const { methods, isSubmitting, onSubmit } = useInquiryForm(defaultSubject);

  if (orientation === "horizontal") {
    return (
      <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <InquiryFormInfoPanel
            title={title}
            description={description}
            whatsappUrl={whatsappUrl}
            whatsappLabel={whatsappLabel}
          />
          <div className="p-6 sm:p-7 lg:col-span-8">
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <InquiryFormFields
                  compact={compact}
                  isSubmitting={isSubmitting}
                  alignSubmitEnd
                />
              </form>
            </FormProvider>
          </div>
        </div>
      </Card>
    );
  }

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
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <InquiryFormFields compact={compact} isSubmitting={isSubmitting} />
        </form>
      </FormProvider>
    </Card>
  );
}
