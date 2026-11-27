import type { Branch } from "@/types/api.types";
import {
  normalizeWhatsappDigits,
  resolveBranchWhatsappDigits,
} from "@/utils/whatsapp";

export interface ResolvedInquiryWhatsappTarget {
  digits: string | null;
  branch: Branch | null;
}

export interface InquiryWhatsappMessageInput {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  branchName?: string | null;
  siteName: string;
  siteUrl?: string;
}

function formatSenderPhone(rawPhone: string): string {
  const digits = normalizeWhatsappDigits(rawPhone);
  return digits ? `+${digits}` : rawPhone.trim();
}

export function resolveInquiryWhatsappTarget(
  branches: Branch[],
  selectedBranchId: string | undefined,
  fallbackSettingsWhatsapp?: string | null
): ResolvedInquiryWhatsappTarget {
  const selectedBranch =
    branches.find((branch) => String(branch.id) === selectedBranchId) ?? null;

  if (selectedBranch) {
    const branchDigits = resolveBranchWhatsappDigits(selectedBranch);
    return {
      digits:
        branchDigits ?? normalizeWhatsappDigits(fallbackSettingsWhatsapp),
      branch: selectedBranch,
    };
  }

  return {
    digits: normalizeWhatsappDigits(fallbackSettingsWhatsapp),
    branch: null,
  };
}

export function buildFormattedInquiryWhatsappMessage(
  input: InquiryWhatsappMessageInput
): string {
  const targetHeading = input.branchName
    ? `${input.siteName} - ${input.branchName}`
    : input.siteName;

  const lines: string[] = [
    `Halo *${targetHeading}*`,
    `Saya ingin menyampaikan *Konsultasi / Pertanyaan* melalui website resmi *${input.siteName}*.`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "*DATA PENGIRIM*",
    `• *Nama:* ${input.name.trim()}`,
    `• *No. WhatsApp:* ${formatSenderPhone(input.phone)}`,
  ];

  const cleanEmail = input.email?.trim() ?? "";
  if (cleanEmail.length > 0) {
    lines.push(`• *Email:* ${cleanEmail}`);
  }

  if (input.branchName) {
    lines.push(`• *Cabang Tujuan:* ${input.branchName}`);
  }

  const cleanSubject = input.subject?.trim() ?? "";
  if (cleanSubject.length > 0) {
    lines.push(`• *Subjek:* ${cleanSubject}`);
  }

  lines.push(
    "",
    "*PESAN / KEBUTUHAN*",
    input.message.trim(),
    "━━━━━━━━━━━━━━━━━━━━",
    `_Dikirim melalui formulir website ${input.siteUrl ?? input.siteName}_`
  );

  return lines.join("\n");
}

export function buildInquiryWhatsappUrl(
  digits: string,
  message: string
): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
