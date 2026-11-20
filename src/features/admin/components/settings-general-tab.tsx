"use client";

import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import type { SettingsFormValues } from "@/features/admin/hooks/use-settings-form";
import { cn } from "@/lib/utils";

const BRAND_COLOR_PRESETS = [
  { hex: "#059669", name: "Emerald" },
  { hex: "#0284c7", name: "Ocean Blue" },
  { hex: "#2563eb", name: "Royal Blue" },
  { hex: "#4f46e5", name: "Indigo" },
  { hex: "#d97706", name: "Amber" },
  { hex: "#e11d48", name: "Crimson" },
];

export function SettingsGeneralTab(): React.JSX.Element {
  const { watch, setValue } = useFormContext<SettingsFormValues>();
  const brandColor = watch("brand_color") || "#059669";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput<SettingsFormValues>
          name="site_title"
          label="Nama Situs / Unit Usaha"
          placeholder="Koperasi Mitrasova Sejahtera"
        />
        <FormInput<SettingsFormValues>
          name="tagline"
          label="Tagline Perusahaan"
          placeholder="Mitra Finansial Terpercaya untuk Kemajuan Bersama"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="brand_color"
            className="block text-xs font-semibold text-slate-700"
          >
            Warna Tema Utama (Brand Color)
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="color"
              aria-label="Pemilih warna tema"
              value={/^#[0-9A-Fa-f]{6}$/.test(brandColor) ? brandColor : "#059669"}
              onChange={(e) => {
                setValue("brand_color", e.target.value, { shouldDirty: true });
              }}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
            />
            <FormInput<SettingsFormValues>
              name="brand_color"
              placeholder="#059669"
              containerClassName="w-36"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {BRAND_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  title={preset.name}
                  aria-label={`Pilih warna ${preset.name}`}
                  onClick={() => {
                    setValue("brand_color", preset.hex, { shouldDirty: true });
                  }}
                  style={{ backgroundColor: preset.hex }}
                  className={cn(
                    "size-6 rounded-full border-2 border-white shadow-xs ring-1 transition-transform hover:scale-110",
                    brandColor.toLowerCase() === preset.hex
                      ? "scale-110 ring-2 ring-slate-900"
                      : "ring-slate-200"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Menentukan warna aksen utama pada website publik dan panel admin.
          </p>
        </div>

        <FormInput<SettingsFormValues>
          name="logo_url"
          label="URL Logo Perusahaan"
          placeholder="https://cdn.mitrasova.id/logo.png"
          helperText="URL gambar logo resmi untuk header dan footer website."
        />
      </div>

      <FormInput<SettingsFormValues>
        name="meta_keywords"
        label="Kata Kunci SEO (Meta Keywords)"
        placeholder="koperasi, layanan keuangan, simpan pinjam, konsultasi bisnis"
        helperText="Pisahkan setiap kata kunci dengan tanda koma."
      />
    </div>
  );
}
