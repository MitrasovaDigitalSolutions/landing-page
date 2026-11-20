"use client";

import { FormDatePicker } from "@/components/forms/form-date-picker";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { savePortfolioAction } from "@/features/portfolio/services/portfolio.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Portfolio, ServiceType } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface PortfolioFormValues {
  title: string;
  slug: string;
  service_type_id: string;
  client_name: string;
  completion_date: string;
  description: string;
  order: number;
  is_featured: boolean;
  thumbnail: File | null;
  gallery: File[];
}

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio: Portfolio | null;
  types: ServiceType[];
}

function buildPortfolioFormData(values: PortfolioFormValues): FormData {
  const fd = new FormData();
  fd.append("title", values.title);
  if (values.slug) fd.append("slug", values.slug);
  if (values.service_type_id) {
    fd.append("service_type_id", values.service_type_id);
  }
  fd.append("client_name", values.client_name);
  fd.append("completion_date", values.completion_date);
  fd.append("description", values.description);
  fd.append("order", String(values.order));
  fd.append("is_featured", values.is_featured ? "1" : "0");

  if (values.thumbnail instanceof File && values.thumbnail.size > 0) {
    fd.append("thumbnail", values.thumbnail);
  }
  for (const file of values.gallery) {
    if (file.size > 0) {
      fd.append("gallery[]", file);
    }
  }
  return fd;
}

function getPortfolioFormValues(
  portfolio: Portfolio | null
): PortfolioFormValues {
  return {
    title: portfolio?.title ?? "",
    slug: portfolio?.slug ?? "",
    service_type_id: portfolio?.service_type_id
      ? String(portfolio.service_type_id)
      : "",
    client_name: portfolio?.client_name ?? "",
    completion_date: portfolio?.completion_date
      ? portfolio.completion_date.slice(0, 10)
      : "",
    description: portfolio?.description ?? "",
    order: portfolio?.order ?? 1,
    is_featured: portfolio?.is_featured ?? false,
    thumbnail: null,
    gallery: [],
  };
}

export function PortfolioFormDialog({
  open,
  onOpenChange,
  portfolio,
  types,
}: PortfolioFormDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<PortfolioFormValues>({
    values: getPortfolioFormValues(portfolio),
  });

  const mutation = useMutation({
    mutationFn: async (values: PortfolioFormValues) =>
      savePortfolioAction(portfolio?.id ?? null, buildPortfolioFormData(values)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
        methods.reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    if (!portfolio && !(values.thumbnail instanceof File)) {
      methods.setError("thumbnail", {
        type: "manual",
        message: "Foto thumbnail wajib diunggah untuk portofolio baru.",
      });
      return;
    }
    mutation.mutate(values);
  });

  const typeOptions = [
    { value: "", label: "Tanpa Tipe Layanan" },
    ...types.map((t) => ({ value: String(t.id), label: t.name })),
  ];

  const existingGallery: ExistingGalleryItem[] = (
    portfolio?.gallery_image_urls ??
    portfolio?.gallery_images ??
    []
  ).map((url, idx) => ({ id: idx, url }));

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) methods.reset();
        onOpenChange(isOpen);
      }}
      title={portfolio ? "Edit Portofolio" : "Tambah Portofolio Baru"}
      description="Dokumentasikan hasil proyek lengkap dengan thumbnail dan galeri foto."
      size="2xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<PortfolioFormValues> name="title" label="Judul Proyek" placeholder="Implementasi Sistem..." containerClassName="sm:col-span-2" required />
            <FormInputStepper<PortfolioFormValues> name="order" label="Urutan" min={1} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputOption<PortfolioFormValues> name="service_type_id" label="Tipe Layanan" options={typeOptions} />
            <FormInput<PortfolioFormValues> name="slug" label="Slug URL (Opsional)" placeholder="Otomatis dari judul" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<PortfolioFormValues> name="client_name" label="Nama Klien / Perusahaan" placeholder="PT Mitra Sejahtera" />
            <FormDatePicker<PortfolioFormValues> name="completion_date" label="Tanggal Selesai" placeholder="Pilih tanggal selesai..." />
          </div>

          <FormTextarea<PortfolioFormValues> name="description" label="Deskripsi Proyek" placeholder="Uraikan lingkup pekerjaan dan hasil yang dicapai..." rows={3} />
          <FormImageUpload<PortfolioFormValues> name="thumbnail" label="Thumbnail Utama" initialUrl={portfolio?.thumbnail_url ?? portfolio?.thumbnail_path} aspectHint="16:9" required={!portfolio} />
          <FormMultiImageUpload<PortfolioFormValues> name="gallery" label="Galeri Foto Tambahan (Opsional)" existingImages={existingGallery} helperText="Unggah beberapa foto dokumentasi tambahan." />
          <FormSwitch<PortfolioFormValues> name="is_featured" label="Tandai Portofolio Unggulan" description="Prioritaskan proyek ini pada bagian showcase utama." />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={portfolio ? "Simpan Perubahan" : "Simpan Portofolio"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
