"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { BaseDialog } from "@/components/ui/base-dialog";
import { savePartnerAction } from "@/features/partners/services/partners.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Partner } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface PartnerFormValues {
  name: string;
  website_url: string;
  order: number;
  logo: File | null;
}

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
}

export function PartnerDialog({
  open,
  onOpenChange,
  partner,
}: PartnerDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<PartnerFormValues>({
    values: {
      name: partner?.name ?? "",
      website_url: partner?.website_url ?? "",
      order: partner?.order ?? 1,
      logo: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: PartnerFormValues) => {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("order", String(values.order));
      if (values.website_url) fd.append("website_url", values.website_url);
      if (values.logo instanceof File && values.logo.size > 0) {
        fd.append("logo", values.logo);
      }

      return savePartnerAction(partner?.id ?? null, fd);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.partners.all });
        methods.reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menyimpan partner.");
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    if (!partner && !(values.logo instanceof File)) {
      methods.setError("logo", {
        type: "manual",
        message: "File logo wajib diunggah saat menambahkan partner baru.",
      });
      return;
    }
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) methods.reset();
        onOpenChange(isOpen);
      }}
      title={partner ? "Edit Partner / Klien" : "Tambah Logo Partner / Klien"}
      description="Logo mitra dan klien akan ditampilkan pada bagian jaringan kemitraan."
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
            <FormInput<PartnerFormValues>
              name="name"
              label="Nama Perusahaan / Mitra"
              placeholder="PT Bank Nasional"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<PartnerFormValues>
              name="order"
              label="Urutan"
              min={1}
            />
          </div>

          <FormInput<PartnerFormValues>
            name="website_url"
            label="Website URL (Opsional)"
            placeholder="https://perusahaan.co.id"
          />

          <FormImageUpload<PartnerFormValues>
            name="logo"
            label="File Logo"
            initialUrl={partner?.logo_url ?? partner?.logo_path}
            required={!partner}
            helperText="Disarankan format PNG transparan atau SVG agar tampil bersih."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={partner ? "Simpan Perubahan" : "Simpan Partner"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
