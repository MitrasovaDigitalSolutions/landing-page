"use client";

import { FormProvider } from "react-hook-form";
import { Building2, Loader2, PhoneCall, Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsContactTab } from "@/features/admin/components/settings-contact-tab";
import { SettingsGeneralTab } from "@/features/admin/components/settings-general-tab";
import { SettingsSocialTab } from "@/features/admin/components/settings-social-tab";
import { useSettingsForm } from "@/features/admin/hooks/use-settings-form";
import type { SiteSettings } from "@/types/site-settings.types";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({
  initialSettings,
}: SettingsFormProps): React.JSX.Element {
  const { methods, isSaving, onSubmit } = useSettingsForm(initialSettings);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6"
      >
        <Tabs defaultValue="general" className="space-y-5">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 sm:w-fit">
            <TabsTrigger
              value="general"
              className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs"
            >
              <Building2 className="size-3.5" />
              <span>Identitas & Branding</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs"
            >
              <PhoneCall className="size-3.5" />
              <span>Kontak & Lokasi</span>
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs"
            >
              <Share2 className="size-3.5" />
              <span>Media Sosial</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-0">
            <SettingsGeneralTab />
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <SettingsContactTab />
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <SettingsSocialTab />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end border-t border-slate-100 pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 gap-2 rounded-xl px-6 text-xs font-semibold shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>
              {isSaving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}
            </span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
