"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveBranchAction } from "@/features/branches/services/branches.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Branch } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface BranchFormValues {
  name: string;
  address: string;
  phone: string;
  order: number;
  is_primary: boolean;
  images: File[];
}

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
}

function getBranchFormValues(branch: Branch | null): BranchFormValues {
  return {
    name: branch?.name ?? "",
    address: branch?.address ?? "",
    phone: branch?.phone ?? "",
    order: branch?.order ?? 0,
    is_primary: branch?.is_primary ?? false,
    images: [],
  };
}

function buildBranchFormData(values: BranchFormValues): FormData {
  const fd = new FormData();
  fd.append("name", values.name.trim());
  fd.append("address", values.address.trim());
  if (values.phone.trim()) fd.append("phone", values.phone.trim());
  fd.append("order", String(values.order));
  fd.append("is_primary", values.is_primary ? "1" : "0");
  for (const file of values.images) {
    if (file.size > 0) fd.append("images[]", file);
  }
  return fd;
}

export function BranchDialog({
  open,
  onOpenChange,
  branch,
}: BranchDialogProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<BranchFormValues>({
    values: getBranchFormValues(branch),
  });

  const mutation = useMutation({
    mutationFn: async (values: BranchFormValues) =>
      saveBranchAction(branch?.id ?? null, buildBranchFormData(values)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
        methods.reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const existingImages: ExistingGalleryItem[] = (branch?.image_urls ?? []).map(
    (url, idx) => ({ id: idx, url })
  );

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) methods.reset();
        onOpenChange(isOpen);
      }}
      title={branch ? "Edit Kantor / Cabang" : "Tambah Kantor / Cabang"}
      description="Kelola data kantor pusat atau cabang beserta foto lokasinya."
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
            <FormInput<BranchFormValues> name="name" label="Nama Kantor / Cabang" placeholder="Kantor Cabang Kerjo" containerClassName="sm:col-span-2" required />
            <FormInputStepper<BranchFormValues> name="order" label="Urutan" min={0} />
          </div>

          <FormTextarea<BranchFormValues> name="address" label="Alamat Lengkap" placeholder="Jl. Batujamus-Karanganyar Km.01..." rows={3} required />
          <FormInput<BranchFormValues> name="phone" label="Nomor Telepon" placeholder="(0271)-6493168" leftIcon={<Phone className="size-4" />} />
          <FormSwitch<BranchFormValues> name="is_primary" label="Tetapkan sebagai Kantor Pusat" description="Kantor pusat ditampilkan paling awal pada daftar kantor." />

          <FormMultiImageUpload<BranchFormValues>
            name="images"
            label="Foto Kantor"
            existingImages={existingImages}
            maxFiles={10}
            helperText={
              branch
                ? "Memilih foto baru akan MENGGANTI semua foto yang tersimpan saat ini."
                : "Unggah satu atau beberapa foto kantor (maks. 10 MB per foto)."
            }
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={branch ? "Simpan Perubahan" : "Simpan Cabang"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
