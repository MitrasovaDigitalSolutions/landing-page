export type ParsedPayloadResult =
  | { ok: true; value: Record<string, unknown> | null }
  | { ok: false; error: string };

export function slugifyPageInput(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export function parseSectionPayloadJson(raw: string): ParsedPayloadResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, value: null };
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {
        ok: false,
        error: "Payload JSON harus berupa objek JSON ({ ... }), bukan array atau teks.",
      };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      error: "Format JSON tidak valid. Periksa koma, tanda kutip, atau kurung kurawal.",
    };
  }
}

export function appendNestedFormData(
  formData: FormData,
  key: string,
  value: unknown
): void {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendNestedFormData(formData, `${key}[${index}]`, item);
    });
    return;
  }

  if (typeof value === "object") {
    for (const [childKey, childVal] of Object.entries(value)) {
      appendNestedFormData(formData, `${key}[${childKey}]`, childVal);
    }
    return;
  }

  if (typeof value === "boolean") {
    formData.append(key, value ? "1" : "0");
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    formData.append(key, String(value));
  }
}
