"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  getInquirySchema,
  type InquiryFormData,
} from "@/features/inquiry/schemas/inquiry.schema";
import {
  submitInquiryAction,
  type SubmitInquiryPayload,
} from "@/features/inquiry/services/inquiry.mutations";
import {
  buildFormattedInquiryWhatsappMessage,
  buildInquiryWhatsappUrl,
  resolveInquiryWhatsappTarget,
} from "@/features/inquiry/utils/inquiry-whatsapp";
import type { Branch } from "@/types/api.types";
import { normalizeWhatsappDigits } from "@/utils/whatsapp";

export interface UseInquiryFormOptions {
  defaultSubject?: string;
  branches?: Branch[];
  fallbackWhatsapp?: string | null;
  siteName?: string;
  siteUrl?: string;
}

export interface UseInquiryFormReturn {
  methods: UseFormReturn<InquiryFormData>;
  isSubmitting: boolean;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  lastWhatsappUrl: string | null;
  hasWhatsappTarget: boolean;
}

function applyServerErrors(
  errors: Record<string, string[]>,
  setError: UseFormReturn<InquiryFormData>["setError"]
): void {
  for (const [field, messages] of Object.entries(errors)) {
    setError(field as keyof InquiryFormData, {
      type: "server",
      message: messages[0],
    });
  }
}

function buildBackendInquiryPayload(
  data: InquiryFormData,
  branchName: string | null
): SubmitInquiryPayload {
  const cleanEmail = data.email?.trim() ?? "";
  const cleanSubject = data.subject?.trim() ?? "";
  let subjectValue = cleanSubject;
  if (branchName) {
    subjectValue = cleanSubject
      ? `[${branchName}] ${cleanSubject}`
      : `Cabang: ${branchName}`;
  }

  return {
    name: data.name.trim(),
    phone: data.phone.trim(),
    ...(cleanEmail.length > 0 ? { email: cleanEmail } : {}),
    ...(subjectValue.length > 0 ? { subject: subjectValue } : {}),
    message: data.message.trim(),
  };
}

export function useInquiryForm({
  defaultSubject = "",
  branches = [],
  fallbackWhatsapp,
  siteName = "Mitrasova",
  siteUrl,
}: UseInquiryFormOptions = {}): UseInquiryFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string | null>(null);
  const schema = useMemo(
    () => getInquirySchema(branches.length > 0),
    [branches.length]
  );

  const methods = useForm<InquiryFormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      branch_id: "",
      name: "",
      phone: "",
      email: "",
      subject: defaultSubject,
      message: "",
    },
  });

  const handleValidSubmit = async (data: InquiryFormData): Promise<void> => {
    const target = resolveInquiryWhatsappTarget(
      branches,
      data.branch_id,
      fallbackWhatsapp
    );
    const waUrl = target.digits
      ? buildInquiryWhatsappUrl(
          target.digits,
          buildFormattedInquiryWhatsappMessage({
            name: data.name,
            phone: data.phone,
            email: data.email,
            subject: data.subject,
            message: data.message,
            branchName: target.branch?.name ?? null,
            siteName,
            siteUrl,
          })
        )
      : null;

    const pendingTab = waUrl ? window.open("about:blank", "_blank") : null;

    setIsSubmitting(true);
    try {
      const payload = buildBackendInquiryPayload(
        data,
        target.branch?.name ?? null
      );
      const result = await submitInquiryAction(payload);

      if (result.success) {
        setLastWhatsappUrl(waUrl);
        if (waUrl && pendingTab && !pendingTab.closed) {
          pendingTab.location.href = waUrl;
          pendingTab.opener = null;
        } else if (waUrl) {
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }
        toast.success(result.message);
        methods.reset({
          branch_id: "",
          name: "",
          phone: "",
          email: "",
          subject: defaultSubject,
          message: "",
        });
      } else {
        pendingTab?.close();
        toast.error(result.message);
        if (result.fieldErrors) {
          applyServerErrors(result.fieldErrors, methods.setError);
        }
      }
    } catch {
      pendingTab?.close();
      toast.error(
        "Gagal mengirim pesan. Silakan periksa koneksi internet Anda."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasWhatsappTarget =
    branches.some((branch) =>
      Boolean(normalizeWhatsappDigits(branch.whatsapp ?? branch.phone))
    ) || Boolean(normalizeWhatsappDigits(fallbackWhatsapp));

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
    void methods.handleSubmit(handleValidSubmit)(e);
  };

  return {
    methods,
    isSubmitting,
    onSubmit,
    lastWhatsappUrl,
    hasWhatsappTarget,
  };
}
