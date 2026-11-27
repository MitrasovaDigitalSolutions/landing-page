"use client";

import { Building2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormInputOption } from "@/components/forms/form-input-option";
import type { OptionItem } from "@/components/ui/input-option";
import type { InquiryFormData } from "@/features/inquiry/schemas/inquiry.schema";
import type { Branch } from "@/types/api.types";
import {
  normalizeWhatsappDigits,
  resolveBranchWhatsappDigits,
} from "@/utils/whatsapp";

interface InquiryBranchSelectProps {
  branches: Branch[];
  fallbackWhatsapp?: string | null;
}

function buildBranchOptions(branches: Branch[]): OptionItem[] {
  return branches.map((branch) => ({
    value: String(branch.id),
    label: branch.is_primary ? `${branch.name} (Pusat)` : branch.name,
    description: branch.address,
  }));
}

export function InquiryBranchSelect({
  branches,
  fallbackWhatsapp,
}: InquiryBranchSelectProps): React.JSX.Element {
  const { control } = useFormContext<InquiryFormData>();
  const selectedBranchId = useWatch({ control, name: "branch_id" });
  const selectedBranch =
    branches.find((b) => String(b.id) === selectedBranchId) ?? null;

  const branchDigits = selectedBranch
    ? resolveBranchWhatsappDigits(selectedBranch)
    : null;
  const fallbackDigits = normalizeWhatsappDigits(fallbackWhatsapp);

  let helperText =
    "Pilih cabang tujuan agar pesan langsung diteruskan ke WhatsApp cabang terkait.";
  if (selectedBranch && branchDigits) {
    helperText = `WhatsApp tujuan: ${selectedBranch.name} (+${branchDigits})`;
  } else if (selectedBranch && fallbackDigits) {
    helperText =
      "Cabang ini belum memiliki nomor WA khusus; pesan dialihkan ke WhatsApp resmi.";
  }

  return (
    <FormInputOption<InquiryFormData>
      name="branch_id"
      label="Pilih Cabang yang Dihubungi"
      required
      options={buildBranchOptions(branches)}
      placeholder="Pilih cabang tujuan..."
      searchPlaceholder="Cari nama cabang atau lokasi..."
      emptyText="Cabang tidak ditemukan."
      leftIcon={<Building2 className="size-4" />}
      helperText={helperText}
    />
  );
}
