"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveFaqCategoryAction } from "@/features/faq/services/faq.actions";
import { queryKeys } from "@/lib/query-keys";
import type { FaqCategory } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface FaqCategoryFormValues {
  name: string;
  slug: string;
  order: number;
}

interface FaqCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: FaqCategory | null;
}

export function FaqCategoryDialog({
  open,
  onOpenChange,
  category,
}: FaqCategoryDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<FaqCategoryFormValues>({
    values: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      order: category?.order ?? 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FaqCategoryFormValues) =>
      saveFaqCategoryAction(category?.id ?? null, {
        name: values.name,
        ...(values.slug ? { slug: values.slug } : {}),
        order: values.order,
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

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? "Edit Kategori FAQ" : "Tambah Kategori FAQ"}
      size="md"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<FaqCategoryFormValues>
              name="name"
              label="Nama Kategori"
              placeholder="Keanggotaan"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<FaqCategoryFormValues>
              name="order"
              label="Urutan"
              min={1}
            />
          </div>

          <FormInput<FaqCategoryFormValues>
            name="slug"
            label="Slug URL (Opsional)"
            placeholder="Otomatis dari nama"
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel="Simpan Kategori"
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
