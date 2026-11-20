"use client";

import {
  inquirySchema,
  type InquiryFormData,
} from "@/features/inquiry/schemas/inquiry.schema";
import { submitInquiryAction } from "@/features/inquiry/services/inquiry.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface UseInquiryFormReturn {
  methods: UseFormReturn<InquiryFormData>;
  isSubmitting: boolean;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
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

export function useInquiryForm(defaultSubject = ""): UseInquiryFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema) as never,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: defaultSubject,
      message: "",
    },
  });

  const handleValidSubmit = async (data: InquiryFormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      if (data.email) formData.append("email", data.email);
      if (data.subject) formData.append("subject", data.subject);
      formData.append("message", data.message);
      if (data.attachment) formData.append("attachment", data.attachment);

      const result = await submitInquiryAction(formData);

      if (result.success) {
        toast.success(result.message);
        methods.reset();
      } else {
        toast.error(result.message);
        if (result.fieldErrors) {
          applyServerErrors(result.fieldErrors, methods.setError);
        }
      }
    } catch {
      toast.error(
        "Gagal mengirim pesan. Silakan periksa koneksi internet Anda."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
    void methods.handleSubmit(handleValidSubmit)(e);
  };

  return {
    methods,
    isSubmitting,
    onSubmit,
  };
}
