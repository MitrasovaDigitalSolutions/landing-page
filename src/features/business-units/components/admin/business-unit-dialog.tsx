"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveBusinessUnitAction } from "@/features/business-units/services/business-units.actions";
import { queryKeys } from "@/lib/query-keys";
import type { BusinessUnit } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface BusinessUnitFormValues {
  name: string;
  address: string;
  url: string;
  order: number;
  image: File | null;
  images: File[];
}

interface BusinessUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: BusinessUnit | null;
}

function getUnitFormValues(unit: BusinessUnit | null): BusinessUnitFormValues {
  return {
    name: unit?.name ?? "",
    address: unit?.address ?? "",
    url: unit?.url ?? "",
    order: unit?.order ?? 0,
    image: null,
    images: [],
  };
}

function buildUnitFormData(values: BusinessUnitFormValues): FormData {
  const fd = new FormData();
  fd.append("name", values.name.trim());
  if (values.address.trim()) fd.append("address", values.address.trim());
  if (values.url.trim()) fd.append("url", values.url.trim());
  fd.append("order", String(values.order));
  if (values.image instanceof File && values.image.size > 0) {
    fd.append("image", values.image);
  }
  for (const file of values.images) {
    if (file.size > 0) fd.append("images[]", file);
  }
  return fd;
}

export function BusinessUnitDialog({
  open,
  onOpenChange,
  unit,
}: BusinessUnitDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<BusinessUnitFormValues>({
    values: getUnitFormValues(unit),
  });

  const mutation = useMutation({
    mutationFn: async (values: BusinessUnitFormValues) =>
      saveBusinessUnitAction(unit?.id ?? null, buildUnitFormData(values)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({
          queryKey: queryKeys.businessUnits.all,
        });
        methods.reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const existingImages: ExistingGalleryItem[] = (unit?.image_urls ?? []).map(
    (url, idx) => ({ id: idx, url })
  );

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) methods.reset();
        onOpenChange(isOpen);
      }}
      title={unit ? "Edit Unit Usaha" : "Tambah Unit Usaha"}
      description="Kelola unit usaha grup beserta foto utama dan galeri carousel."
      size="xl"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<BusinessUnitFormValues> name="name" label="Nama Unit Usaha" placeholder="Mitra Sejati Percetakan" containerClassName="sm:col-span-2" required />
            <FormInputStepper<BusinessUnitFormValues> name="order" label="Urutan" min={0} />
          </div>

          <FormTextarea<BusinessUnitFormValues> name="address" label="Alamat" placeholder="Jl. Jambangan - Grompol Km. 1" rows={2} />
          <FormInput<BusinessUnitFormValues> name="url" label="Tautan Website (Opsional)" placeholder="https://unit-usaha.co.id" type="url" leftIcon={<Globe className="size-4" />} />

          <FormImageUpload<BusinessUnitFormValues>
            name="image"
            label="Foto Utama"
            initialUrl={unit?.image_url ?? unit?.image_path}
            maxSizeMB={10}
            aspectHint="16:9"
          />

          <FormMultiImageUpload<BusinessUnitFormValues>
            name="images"
            label="Galeri Foto (Carousel)"
            existingImages={existingImages}
            maxFiles={10}
            helperText={
              unit
                ? "Memilih foto galeri baru akan MENGGANTI galeri yang tersimpan saat ini."
                : "Foto tambahan akan tampil sebagai carousel pada website."
            }
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={unit ? "Simpan Perubahan" : "Simpan Unit Usaha"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
