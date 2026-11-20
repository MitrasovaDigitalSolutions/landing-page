"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  createSiteAction,
  updateSiteAction,
} from "@/features/auth/services/users.actions";
import type { ManagedSite } from "@/features/auth/types/user-management.types";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Globe } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface SiteFormValues {
  name: string;
  slug: string;
  domain: string;
  is_active: boolean;
}

interface SiteFormDialogProps {
  site: ManagedSite | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SiteFormDialog({
  site,
  open,
  onOpenChange,
  onSuccess,
}: SiteFormDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const methods = useForm<SiteFormValues>({
    values: {
      name: site?.name ?? "",
      slug: site?.slug ?? "",
      domain: site?.domain ?? "",
      is_active: site?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SiteFormValues) => {
      const payload = {
        name: values.name,
        ...(values.slug ? { slug: values.slug } : {}),
        ...(values.domain ? { domain: values.domain } : {}),
        is_active: values.is_active,
      };
      return site
        ? updateSiteAction(site.id, payload)
        : createSiteAction(payload);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
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
      onOpenChange={onOpenChange}
      title={site ? "Edit Unit Usaha (Site)" : "Tambah Unit Usaha Baru"}
      description="Konfigurasi identitas tenant, slug, dan domain unit usaha."
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <FormInput<SiteFormValues>
            name="name"
            label="Nama Unit Usaha"
            placeholder="Mitrasova Konveksi"
            leftIcon={<Building2 className="size-4" />}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<SiteFormValues>
              name="slug"
              label="Slug Tenant"
              placeholder="konveksi"
            />
            <FormInput<SiteFormValues>
              name="domain"
              label="Domain"
              placeholder="konveksi.mitrasova.id"
              leftIcon={<Globe className="size-4" />}
            />
          </div>

          <FormSwitch<SiteFormValues>
            name="is_active"
            label="Status Unit Usaha Aktif"
            description="Aktifkan tenant agar landing page dan dashboard dapat diakses."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={site ? "Simpan Perubahan" : "Simpan Site"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
