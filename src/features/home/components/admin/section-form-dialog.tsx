"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Badge } from "@/components/ui/badge";
import { BaseDialog } from "@/components/ui/base-dialog";
import { SectionJsonField } from "@/features/home/components/admin/section-json-field";
import { SectionKeyField } from "@/features/home/components/admin/section-key-field";
import {
  type PageActionResult,
  saveSectionAction,
  saveSectionJsonAction,
} from "@/features/home/services/pages.actions";
import {
  appendNestedFormData,
  parseSectionPayloadJson,
} from "@/features/home/utils/section-form-data";
import { queryKeys } from "@/lib/query-keys";
import type { PageSection } from "@/types/api.types";

interface SectionFormValues {
  key: string;
  order: number;
  title: string;
  subtitle: string;
  body: string;
  payload_json: string;
  image: File | null;
}

interface SectionFormDialogProps {
  pageId: number;
  pageSlug: string;
  section: PageSection | null;
  defaultOrder: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function getInitialSectionValues(
  section: PageSection | null,
  defaultOrder: number
): SectionFormValues {
  return {
    key: section?.key ?? "",
    order: section?.order ?? defaultOrder,
    title: section?.title ?? "",
    subtitle: section?.subtitle ?? "",
    body: section?.body ?? "",
    payload_json: section?.payload
      ? JSON.stringify(section.payload, null, 2)
      : "",
    image: null,
  };
}

function buildSectionMultipart(
  values: SectionFormValues,
  parsedPayload: Record<string, unknown> | null
): FormData {
  const formData = new FormData();
  formData.append("key", values.key.trim());
  formData.append("order", String(values.order));
  formData.append("title", values.title.trim());
  formData.append("subtitle", values.subtitle.trim());
  formData.append("body", values.body.trim());

  if (parsedPayload) {
    appendNestedFormData(formData, "payload", parsedPayload);
  }
  if (values.image instanceof File && values.image.size > 0) {
    formData.append("image", values.image);
  }
  return formData;
}

async function submitSection(
  pageId: number,
  pageSlug: string,
  sectionId: number | null,
  values: SectionFormValues,
  parsedPayload: Record<string, unknown> | null
): Promise<PageActionResult> {
  const hasNewImage = values.image instanceof File && values.image.size > 0;
  if (hasNewImage) {
    const formData = buildSectionMultipart(values, parsedPayload);
    return saveSectionAction(pageId, sectionId, formData, pageSlug);
  }

  return saveSectionJsonAction(
    pageId,
    sectionId,
    {
      key: values.key.trim(),
      order: values.order,
      title: values.title.trim() || null,
      subtitle: values.subtitle.trim() || null,
      body: values.body.trim() || null,
      payload: parsedPayload,
    },
    pageSlug
  );
}

export function SectionFormDialog({
  pageId,
  pageSlug,
  section,
  defaultOrder,
  open,
  onOpenChange,
  onSuccess,
}: SectionFormDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const isEdit = Boolean(section);

  const methods = useForm<SectionFormValues>({
    values: getInitialSectionValues(section, defaultOrder),
  });

  const watchedKey = useWatch({
    control: methods.control,
    name: "key",
  });

  const mutation = useMutation({
    mutationFn: async (input: {
      values: SectionFormValues;
      parsedPayload: Record<string, unknown> | null;
    }) =>
      submitSection(
        pageId,
        pageSlug,
        section?.id ?? null,
        input.values,
        input.parsedPayload
      ),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.pages.all });
        methods.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message);
      }
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    const parsed = parseSectionPayloadJson(values.payload_json);
    if (!parsed.ok) {
      methods.setError("payload_json", { message: parsed.error });
      return;
    }
    mutation.mutate({ values, parsedPayload: parsed.value });
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          methods.reset();
        }
        onOpenChange(nextOpen);
      }}
      title={isEdit ? "Edit Section Halaman" : "Tambah Section Baru"}
      description={`Kelola isi konten section untuk halaman /${pageSlug}.`}
      size="xl"
      headerRight={
        <Badge
          variant="secondary"
          className="gap-1 rounded-md font-mono text-[11px]"
        >
          <Layers className="size-3" />
          key: {watchedKey || "-"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SectionKeyField showPresets={!isEdit} />
            <FormInputStepper<SectionFormValues>
              name="order"
              label="Urutan Tampil"
              min={0}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<SectionFormValues>
              name="title"
              label="Judul Section"
              placeholder="Judul utama section"
              maxLength={200}
            />
            <FormInput<SectionFormValues>
              name="subtitle"
              label="Sub Judul / Badge"
              placeholder="Opsional"
              maxLength={255}
            />
          </div>

          <FormTextarea<SectionFormValues>
            name="body"
            label="Isi / Deskripsi Konten"
            placeholder="Teks narasi atau deskripsi section..."
            rows={4}
          />

          <FormImageUpload<SectionFormValues>
            name="image"
            label="Gambar Section (Opsional)"
            initialUrl={section?.image_url ?? section?.image_path}
            maxSizeMB={10}
            helperText="Unggah gambar baru untuk mengganti media utama section ini (maks. 10MB)."
          />

          <SectionJsonField />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Section"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
