"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInputOption } from "@/components/forms/form-input-option";
import { BaseDialog } from "@/components/ui/base-dialog";
import { UserAssignedSitesList } from "@/features/auth/components/admin/user-assigned-sites-list";
import {
  assignUserToSiteAction,
  detachUserFromSiteAction,
} from "@/features/auth/services/users.actions";
import type {
  ManagedSite,
  ManagedUser,
} from "@/features/auth/types/user-management.types";
import { queryKeys } from "@/lib/query-keys";

interface AssignFormValues {
  site_id: string;
  role: "admin" | "editor";
}

interface UserSiteAssignDialogProps {
  user: ManagedUser | null;
  sites: ManagedSite[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
];

export function UserSiteAssignDialog({
  user,
  sites,
  open,
  onOpenChange,
  onSuccess,
}: UserSiteAssignDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const fallbackSiteId = sites[0] ? sites[0].id : "";
  const methods = useForm<AssignFormValues>({
    values: {
      site_id: fallbackSiteId,
      role: "admin",
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (values: AssignFormValues) => {
      if (!user) throw new Error("User tidak ditemukan.");
      return assignUserToSiteAction(values.site_id, user.id, values.role);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        onSuccess();
      } else {
        toast.error(res.message);
      }
    },
  });

  const detachMutation = useMutation({
    mutationFn: async (siteId: string) => {
      if (!user) throw new Error("User tidak ditemukan.");
      return detachUserFromSiteAction(siteId, user.id);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        onSuccess();
      } else {
        toast.error(res.message);
      }
    },
  });

  const siteOptions = sites.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.slug})`,
  }));

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Penugasan Site: ${user?.name ?? ""}`}
      description="Atur unit usaha yang dapat dikelola oleh admin atau editor ini."
      size="lg"
    >
      <div className="space-y-4">
        <UserAssignedSitesList
          sites={user?.sites ?? []}
          isBusy={detachMutation.isPending}
          onDetach={(siteId) => {
            detachMutation.mutate(siteId);
          }}
        />

        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              void methods.handleSubmit((v) => {
                assignMutation.mutate(v);
              })(e);
            }}
            className="space-y-4 border-t border-slate-100 pt-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInputOption<AssignFormValues>
                name="site_id"
                label="Pilih Unit Usaha"
                options={siteOptions}
                containerClassName="sm:col-span-2"
                required
              />
              <FormInputOption<AssignFormValues>
                name="role"
                label="Role Akses"
                searchable={false}
                options={ROLE_OPTIONS}
              />
            </div>

            <FormDialogFooter
              onCancel={() => {
                onOpenChange(false);
              }}
              cancelLabel="Tutup"
              submitLabel="Assign ke Site"
              isSubmitting={assignMutation.isPending}
              className="pt-3"
            />
          </form>
        </FormProvider>
      </div>
    </BaseDialog>
  );
}
