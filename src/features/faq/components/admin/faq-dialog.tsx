"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveFaqAction } from "@/features/faq/services/faq.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Faq, FaqCategory } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface FaqFormValues {
  question: string;
  faq_category_id: string;
  order: number;
  answer: string;
  is_active: boolean;
}

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: Faq | null;
  categories: FaqCategory[];
}

export function FaqDialog({
  open,
  onOpenChange,
  faq,
  categories,
}: FaqDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const fallbackCatId = categories[0] ? String(categories[0].id) : "";
  const methods = useForm<FaqFormValues>({
    values: {
      question: faq?.question ?? "",
      faq_category_id: faq?.faq_category_id
        ? String(faq.faq_category_id)
        : fallbackCatId,
      order: faq?.order ?? 1,
      answer: faq?.answer ?? "",
      is_active: faq?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FaqFormValues) =>
      saveFaqAction(faq?.id ?? null, {
        question: values.question,
        answer: values.answer,
        faq_category_id: values.faq_category_id
          ? Number(values.faq_category_id)
          : null,
        order: values.order,
        is_active: values.is_active,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const catOptions = [
    { value: "", label: "Umum" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={faq ? "Edit Tanya Jawab (FAQ)" : "Tambah FAQ Baru"}
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void methods.handleSubmit((v) => {
              mutation.mutate(v);
            })(e);
          }}
          className="space-y-4"
        >
          <FormInput<FaqFormValues>
            name="question"
            label="Pertanyaan"
            placeholder="Bagaimana cara menjadi anggota?"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInputOption<FaqFormValues>
              name="faq_category_id"
              label="Kategori"
              options={catOptions}
              containerClassName="sm:col-span-2"
            />
            <FormInputStepper<FaqFormValues>
              name="order"
              label="Urutan"
              min={1}
            />
          </div>

          <FormTextarea<FaqFormValues>
            name="answer"
            label="Jawaban"
            placeholder="Tuliskan jawaban secara jelas dan mudah dipahami..."
            rows={4}
            required
          />

          <FormSwitch<FaqFormValues>
            name="is_active"
            label="Tampilkan Aktif di Halaman Publik"
            description="Nonaktifkan sementara jika pertanyaan belum relevan."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={faq ? "Simpan Perubahan" : "Simpan FAQ"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
