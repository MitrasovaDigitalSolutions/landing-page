"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveArticleCategoryAction } from "@/features/articles/services/articles.actions";
import { queryKeys } from "@/lib/query-keys";
import type { ArticleCategory } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ArticleCategoryFormValues {
  name: string;
  slug: string;
  description: string;
  order: number;
}

interface ArticleCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ArticleCategory | null;
}

export function ArticleCategoryDialog({
  open,
  onOpenChange,
  category,
}: ArticleCategoryDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<ArticleCategoryFormValues>({
    values: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      order: category?.order ?? 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ArticleCategoryFormValues) =>
      saveArticleCategoryAction(category?.id ?? null, {
        name: values.name,
        ...(values.slug ? { slug: values.slug } : {}),
        description: values.description || null,
        order: values.order,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
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
      title={category ? "Edit Kategori Artikel" : "Tambah Kategori Artikel"}
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<ArticleCategoryFormValues>
              name="name"
              label="Nama Kategori"
              placeholder="Edukasi Finansial"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<ArticleCategoryFormValues>
              name="order"
              label="Urutan"
              min={1}
            />
          </div>

          <FormInput<ArticleCategoryFormValues>
            name="slug"
            label="Slug URL (Opsional)"
            placeholder="Otomatis dari nama"
          />

          <FormTextarea<ArticleCategoryFormValues>
            name="description"
            label="Deskripsi (Opsional)"
            rows={2}
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
