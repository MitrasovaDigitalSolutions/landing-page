import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const inquirySchema = z.object({
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
  attachment: z
    .custom<File | null>((val) => val === null || val instanceof File, {
      message: "File tidak valid",
    })
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Ukuran lampiran maksimal 10MB",
    })
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
      {
        message: "Format file harus PDF, JPG, PNG, atau DOC/DOCX",
      }
    )
    .optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
