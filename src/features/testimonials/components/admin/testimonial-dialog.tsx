"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveTestimonialAction } from "@/features/testimonials/services/testimonials.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Testimonial } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface TestimonialFormValues {
  name: string;
  title: string;
  rating: number;
  order: number;
  message: string;
  is_active: boolean;
  avatar: File | null;
}

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
}

function buildTestimonialFormData(values: TestimonialFormValues): FormData {
  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("title", values.title);
  fd.append("rating", String(values.rating));
  fd.append("order", String(values.order));
  fd.append("message", values.message);
  fd.append("is_active", values.is_active ? "1" : "0");
  if (values.avatar instanceof File && values.avatar.size > 0) {
    fd.append("avatar", values.avatar);
  }
  return fd;
}

export function TestimonialDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<TestimonialFormValues>({
    values: {
      name: testimonial?.name ?? "",
      title: testimonial?.title ?? "",
      rating: testimonial?.rating ?? 5,
      order: testimonial?.order ?? 1,
      message: testimonial?.message ?? "",
      is_active: testimonial?.is_active ?? true,
      avatar: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TestimonialFormValues) =>
      saveTestimonialAction(
        testimonial?.id ?? null,
        buildTestimonialFormData(values)
      ),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({
          queryKey: queryKeys.testimonials.all,
        });
        methods.reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) methods.reset();
        onOpenChange(isOpen);
      }}
      title={testimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}
      description="Tambahkan ulasan dari klien atau mitra untuk membangun kepercayaan publik."
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
            <FormInput<TestimonialFormValues>
              name="name"
              label="Nama Klien"
              placeholder="Budi Santoso"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<TestimonialFormValues>
              name="order"
              label="Urutan"
              min={1}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<TestimonialFormValues>
              name="title"
              label="Jabatan / Nama Usaha"
              placeholder="Direktur PT Sejahtera"
            />
            <FormInputStepper<TestimonialFormValues>
              name="rating"
              label="Penilaian"
              min={1}
              max={5}
              unit="/ 5"
            />
          </div>

          <FormTextarea<TestimonialFormValues>
            name="message"
            label="Isi Ulasan / Testimoni"
            placeholder="Tuliskan kutipan pengalaman klien..."
            rows={3}
            required
          />

          <FormImageUpload<TestimonialFormValues>
            name="avatar"
            label="Foto Profil Klien (Opsional)"
            initialUrl={testimonial?.avatar_url ?? testimonial?.avatar_path}
            aspectHint="1:1"
          />

          <FormSwitch<TestimonialFormValues>
            name="is_active"
            label="Tampilkan Aktif di Halaman Publik"
            description="Sertakan testimoni ini pada bagian ulasan klien."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={testimonial ? "Simpan Perubahan" : "Simpan Testimoni"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
