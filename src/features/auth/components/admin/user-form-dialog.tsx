"use client";

import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  createUserAction,
  updateUserAction,
} from "@/features/auth/services/users.actions";
import type { ManagedUser } from "@/features/auth/types/user-management.types";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, Mail, User } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  is_superadmin: boolean;
}

interface UserFormDialogProps {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UserFormDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserFormDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const methods = useForm<UserFormValues>({
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      is_superadmin: user?.is_superadmin ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const payload = {
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {}),
        is_superadmin: values.is_superadmin,
      };
      return user
        ? updateUserAction(user.id, payload)
        : createUserAction(payload);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
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
      title={user ? "Edit Pengguna Admin" : "Tambah Admin Baru"}
      description="Kelola profil akses admin dan hak istimewa tingkat sistem."
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <FormInput<UserFormValues>
            name="name"
            label="Nama Lengkap"
            placeholder="John Doe"
            leftIcon={<User className="size-4" />}
            required
          />

          <FormInput<UserFormValues>
            name="email"
            label="Alamat Email"
            type="email"
            placeholder="admin@mitrasova.id"
            leftIcon={<Mail className="size-4" />}
            required
          />

          <FormInput<UserFormValues>
            name="password"
            label={user ? "Password Baru (Opsional)" : "Password Akun"}
            type="password"
            placeholder="Minimal 8 karakter"
            leftIcon={<Lock className="size-4" />}
            helperText={
              user ? "Kosongkan jika tidak ingin mengganti password." : undefined
            }
            required={!user}
          />

          <FormSwitch<UserFormValues>
            name="is_superadmin"
            label="Hak Akses Superadmin"
            description="Mengizinkan akses penuh ke seluruh unit usaha dan manajemen pengguna."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={user ? "Simpan Perubahan" : "Simpan Admin"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
