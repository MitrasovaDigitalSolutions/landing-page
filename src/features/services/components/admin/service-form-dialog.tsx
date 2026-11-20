"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormFeatureList } from "@/components/forms/form-feature-list";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveServiceAction } from "@/features/services/services/services.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Service, ServiceType } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ServiceFormValues {
  name: string;
  slug: string;
  service_type_id: string;
  short_desc: string;
  body: string;
  features: string[];
  order: number;
  is_active: boolean;
  is_featured: boolean;
  thumbnail: File | null;
  icon: File | null;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  types: ServiceType[];
}

function buildServiceFormData(values: ServiceFormValues): FormData {
  const fd = new FormData();
  fd.append("name", values.name);
  if (values.slug) fd.append("slug", values.slug);
  fd.append("service_type_id", values.service_type_id);
  fd.append("short_desc", values.short_desc);
  fd.append("body", values.body);
  fd.append("order", String(values.order));
  fd.append("is_active", values.is_active ? "1" : "0");
  fd.append("is_featured", values.is_featured ? "1" : "0");

  values.features
    .map((f) => f.trim())
    .filter(Boolean)
    .forEach((f) => {
      fd.append("features[]", f);
    });

  if (values.thumbnail instanceof File && values.thumbnail.size > 0) {
    fd.append("thumbnail", values.thumbnail);
  }
  if (values.icon instanceof File && values.icon.size > 0) {
    fd.append("icon", values.icon);
  }
  return fd;
}

function getServiceFormValues(
  service: Service | null,
  types: ServiceType[]
): ServiceFormValues {
  const fallbackTypeId = types[0] ? String(types[0].id) : "";
  return {
    name: service?.name ?? "",
    slug: service?.slug ?? "",
    service_type_id: service ? String(service.service_type_id) : fallbackTypeId,
    short_desc: service?.short_desc ?? "",
    body: service?.body ?? "",
    features: service?.features ?? [],
    order: service?.order ?? 1,
    is_active: service?.is_active ?? true,
    is_featured: service?.is_featured ?? false,
    thumbnail: null,
    icon: null,
  };
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  types,
}: ServiceFormDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<ServiceFormValues>({
    values: getServiceFormValues(service, types),
  });

  const mutation = useMutation({
    mutationFn: async (values: ServiceFormValues) =>
      saveServiceAction(service?.id ?? null, buildServiceFormData(values)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
        methods.reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const typeOptions = types.map((t) => ({
    value: String(t.id),
    label: t.name,
  }));

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) methods.reset();
        onOpenChange(isOpen);
      }}
      title={service ? "Edit Layanan" : "Tambah Layanan Baru"}
      description="Lengkapi informasi layanan, fitur keunggulan, serta media pendukung."
      size="2xl"
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
            <FormInput<ServiceFormValues> name="name" label="Nama Layanan" placeholder="Simpanan Berjangka Prima" containerClassName="sm:col-span-2" required />
            <FormInputStepper<ServiceFormValues> name="order" label="Urutan Tampil" min={1} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputOption<ServiceFormValues> name="service_type_id" label="Tipe Layanan" placeholder="Pilih tipe layanan..." options={typeOptions} required />
            <FormInput<ServiceFormValues> name="slug" label="Slug URL" placeholder="Otomatis dari nama layanan" />
          </div>

          <FormInput<ServiceFormValues> name="short_desc" label="Ringkasan Singkat" placeholder="Deskripsi 1-2 kalimat untuk kartu layanan..." required />
          <FormTextarea<ServiceFormValues> name="body" label="Deskripsi Lengkap" placeholder="Jelaskan detail produk/layanan secara komprehensif..." rows={3} required />
          <FormFeatureList<ServiceFormValues>
            name="features"
            label="Fitur & Keunggulan Layanan"
            helperText="Tekan Enter atau klik Tambah Poin. Bisa juga menempel (paste) beberapa baris sekaligus."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormImageUpload<ServiceFormValues> name="thumbnail" label="Foto Thumbnail" initialUrl={service?.thumbnail_url ?? service?.thumbnail_path} aspectHint="16:9" />
            <FormImageUpload<ServiceFormValues> name="icon" label="File Ikon (Opsional)" initialUrl={service?.icon_url ?? service?.icon_path} aspectHint="1:1" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormSwitch<ServiceFormValues> name="is_active" label="Aktif di Website" description="Tampilkan layanan pada halaman publik." />
            <FormSwitch<ServiceFormValues> name="is_featured" label="Layanan Unggulan" description="Sorot di halaman beranda utama." />
          </div>

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={service ? "Simpan Perubahan" : "Simpan Layanan"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
