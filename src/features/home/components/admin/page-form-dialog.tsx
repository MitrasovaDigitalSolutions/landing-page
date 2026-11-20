"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Badge } from "@/components/ui/badge";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  createPageAction,
  updatePageAction,
} from "@/features/home/services/pages.actions";
import { slugifyPageInput } from "@/features/home/utils/section-form-data";
import { queryKeys } from "@/lib/query-keys";
import type { PageDetail } from "@/types/api.types";

interface PageFormValues {
  title: string;
  slug: string;
  meta_title: string;
  meta_desc: string;
  is_published: boolean;
}

interface PageFormDialogProps {
  page: PageDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PageFormDialog({
  page,
  open,
  onOpenChange,
  onSuccess,
}: PageFormDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const isEdit = Boolean(page);
  const isHomeLocked = page?.slug === "home";

  const methods = useForm<PageFormValues>({
    values: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      meta_title: page?.meta_title ?? "",
      meta_desc: page?.meta_desc ?? "",
      is_published: page ? page.is_published !== false : true,
    },
  });

  const [watchedTitle, watchedSlug] = useWatch({
    control: methods.control,
    name: ["title", "slug"],
  });
  const previewSlug =
    slugifyPageInput(watchedSlug) || slugifyPageInput(watchedTitle) || "slug";

  const mutation = useMutation({
    mutationFn: async (values: PageFormValues) => {
      const resolvedSlug = isHomeLocked
        ? "home"
        : slugifyPageInput(values.slug) || slugifyPageInput(values.title);

      const payload: Record<string, unknown> = {
        title: values.title.trim(),
        meta_title: values.meta_title.trim() || null,
        meta_desc: values.meta_desc.trim() || null,
        is_published: values.is_published,
      };
      if (resolvedSlug) {
        payload.slug = resolvedSlug;
      }

      return page
        ? updatePageAction(page.id, payload)
        : createPageAction(payload);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.pages.all });
        if (!page) {
          methods.reset();
        }
        onOpenChange(false);
        onSuccess();
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
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !page) {
          methods.reset();
        }
        onOpenChange(nextOpen);
      }}
      title={isEdit ? "Edit Halaman & SEO" : "Tambah Halaman Baru"}
      description="Atur judul, slug URL, metadata SEO, dan status publikasi halaman."
      size="lg"
      headerRight={
        <Badge
          variant="secondary"
          className="gap-1 rounded-md font-mono text-[11px]"
        >
          {isHomeLocked ? <Lock className="size-3" /> : null}
          <span>/{isHomeLocked ? "home" : previewSlug}</span>
        </Badge>
      }
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<PageFormValues>
              name="title"
              label="Judul Halaman"
              placeholder="Contoh: Tentang Kami"
              maxLength={150}
              required
            />

            <FormInput<PageFormValues>
              name="slug"
              label="Slug URL"
              placeholder={slugifyPageInput(watchedTitle) || "tentang-kami"}
              maxLength={50}
              disabled={isHomeLocked}
              helperText={
                isHomeLocked
                  ? "Slug Beranda utama dikunci sistem."
                  : "Kosongkan untuk membuat otomatis dari judul."
              }
            />
          </div>

          <FormInput<PageFormValues>
            name="meta_title"
            label="Meta Title SEO"
            placeholder="Contoh: Tentang Kami | KSP Mitra Sejati Persada"
            maxLength={200}
          />

          <FormTextarea<PageFormValues>
            name="meta_desc"
            label="Meta Description SEO"
            placeholder="Deskripsi singkat halaman untuk hasil pencarian Google..."
            rows={3}
            maxLength={300}
          />

          <FormSwitch<PageFormValues>
            name="is_published"
            label="Publikasikan Halaman"
            description="Tampilkan halaman ini secara publik agar dapat diakses pengunjung."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={isEdit ? "Simpan Perubahan" : "Buat Halaman"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
