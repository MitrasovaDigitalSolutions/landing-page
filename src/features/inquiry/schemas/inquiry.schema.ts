import { z } from "zod";

const inquiryBaseFields = {
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(8, "Nomor telepon/WhatsApp minimal 8 digit")
    .regex(/^[0-9+-\s]+$/, "Format nomor telepon tidak valid"),
  email: z
    .email({ message: "Format email tidak valid" })
    .optional()
    .or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(5, "Pesan minimal 5 karakter"),
};

export const inquirySchema = z.object({
  ...inquiryBaseFields,
  branch_id: z.string().optional(),
});

export const inquiryWithBranchSchema = z.object({
  ...inquiryBaseFields,
  branch_id: z
    .string()
    .trim()
    .min(1, "Silakan pilih cabang yang akan dihubungi"),
});

export function getInquirySchema(
  requireBranch: boolean
): typeof inquirySchema | typeof inquiryWithBranchSchema {
  return requireBranch ? inquiryWithBranchSchema : inquirySchema;
}

export type InquiryFormData = z.infer<typeof inquirySchema>;
