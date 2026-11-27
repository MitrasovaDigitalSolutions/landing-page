"use client";

import { Building2, MessageCircle } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function formatBranchOptionLabel(branch: Branch): string {
  return branch.is_primary ? `${branch.name} (Pusat)` : branch.name;
}

export function InquiryBranchSelect({
  branches,
  fallbackWhatsapp,
}: InquiryBranchSelectProps): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<InquiryFormData>();

  const selectedBranchId = useWatch({ control, name: "branch_id" });
  const selectedBranch =
    branches.find((b) => String(b.id) === selectedBranchId) ?? branches.at(0);

  const branchDigits = selectedBranch
    ? resolveBranchWhatsappDigits(selectedBranch)
    : null;
  const fallbackDigits = normalizeWhatsappDigits(fallbackWhatsapp);

  let helperText = "Permohonan akan dikirimkan ke tim layanan kami.";
  if (branchDigits && selectedBranch) {
    helperText = `WhatsApp tujuan: ${selectedBranch.name} (+${branchDigits})`;
  } else if (fallbackDigits) {
    helperText =
      "Cabang ini belum memiliki nomor WA khusus; pesan dialihkan ke WhatsApp resmi.";
  }

  return (
    <FormField
      id="inquiry-branch"
      label="Pilih Cabang yang Dihubungi"
      error={errors.branch_id?.message}
    >
      <Controller
        control={control}
        name="branch_id"
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={(nextValue) => {
              if (typeof nextValue === "string") {
                field.onChange(nextValue);
              }
            }}
          >
            <SelectTrigger
              id="inquiry-branch"
              className="h-10 w-full rounded-xl border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-800 data-[size=default]:h-10"
            >
              <SelectValue>
                <span className="inline-flex items-center gap-2 truncate">
                  <Building2 className="size-4 shrink-0 text-primary" />
                  <span className="truncate">
                    {selectedBranch
                      ? formatBranchOptionLabel(selectedBranch)
                      : "Pilih cabang tujuan"}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={String(branch.id)}>
                  {formatBranchOptionLabel(branch)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <p className="flex items-center gap-1.5 pt-0.5 text-[11px] font-medium text-slate-500">
        <MessageCircle className="size-3.5 shrink-0 text-emerald-600" />
        <span>{helperText}</span>
      </p>
    </FormField>
  );
}
