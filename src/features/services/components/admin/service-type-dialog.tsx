"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveServiceTypeAction } from "@/features/services/services/services.actions";
import { queryKeys } from "@/lib/query-keys";
import type { ServiceType } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ServiceTypeFormValues {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

interface ServiceTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: ServiceType | null;
}

export function ServiceTypeDialog({
  open,
  onOpenChange,
  serviceType,
}: ServiceTypeDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<ServiceTypeFormValues>({
    values: {
      name: serviceType?.name ?? "",
      slug: serviceType?.slug ?? "",
      description: serviceType?.description ?? "",
      icon: serviceType?.icon ?? "piggy-bank",
      order: serviceType?.order ?? 1,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ServiceTypeFormValues) =>
      saveServiceTypeAction(serviceType?.id ?? null, {
        name: values.name,
        ...(values.slug ? { slug: values.slug } : {}),
        description: values.description || null,
        icon: values.icon,
        order: values.order,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
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
      title={serviceType ? "Edit Tipe Layanan" : "Tambah Tipe Layanan Baru"}
      description="Kelompokkan produk atau layanan ke dalam kategori tipe layanan."
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
            <FormInput<ServiceTypeFormValues>
              name="name"
              label="Nama Tipe Layanan"
              placeholder="Simpanan Berjangka"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<ServiceTypeFormValues>
              name="order"
              label="Urutan"
              min={1}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<ServiceTypeFormValues>
              name="slug"
              label="Slug (Opsional)"
              placeholder="Otomatis dari nama"
            />
            <FormInput<ServiceTypeFormValues>
              name="icon"
              label="Nama Ikon"
              placeholder="piggy-bank, wallet, landmark"
            />
          </div>

          <FormTextarea<ServiceTypeFormValues>
            name="description"
            label="Deskripsi Singkat (Opsional)"
            placeholder="Ringkasan kategori tipe layanan..."
            rows={2}
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={serviceType ? "Simpan Perubahan" : "Simpan Tipe"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
