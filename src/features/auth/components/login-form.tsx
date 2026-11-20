"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const methods = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    setAuthError(null);
    if (!values.email.trim()) {
      methods.setError("email", { message: "Email wajib diisi." });
      return;
    }
    if (!values.password) {
      methods.setError("password", { message: "Password wajib diisi." });
      return;
    }

    const res = await signIn("credentials", {
      email: values.email.trim(),
      password: values.password,
      redirect: false,
    });

    if (res.error) {
      const msg = "Email atau kata sandi tidak valid. Silakan periksa kembali.";
      setAuthError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Login berhasil! Mengalihkan ke portal manajemen...");
    router.push("/admin");
    router.refresh();
  });

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Portal Manajemen Mitrasova
        </h1>
        <p className="text-xs leading-relaxed text-slate-500">
          Masuk menggunakan akun administrator untuk mengelola konten dan unit usaha.
        </p>
      </div>

      {authError ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
          {authError}
        </div>
      ) : null}

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <FormInput<LoginFormValues>
            name="email"
            type="email"
            label="Alamat Email"
            placeholder="admin@mitrasova.id"
            autoComplete="email"
            leftIcon={<Mail className="size-4" />}
            required
          />

          <div className="space-y-1.5">
            <div className="relative">
              <FormInput<LoginFormValues>
                name="password"
                type={showPassword ? "text" : "password"}
                label="Kata Sandi"
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                leftIcon={<Lock className="size-4" />}
                className="pr-10"
                required
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                }
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
                className="absolute top-[30px] right-2.5 flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={methods.formState.isSubmitting}
            className="mt-2 h-10 w-full gap-2 rounded-xl text-xs font-semibold shadow-xs"
          >
            {methods.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memproses Login...</span>
              </>
            ) : (
              <span>Masuk ke Portal Admin</span>
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
