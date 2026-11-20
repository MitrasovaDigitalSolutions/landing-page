"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { saveAdminSettingsAction } from "@/features/admin/services/settings.actions";
import { queryKeys } from "@/lib/query-keys";
import type {
  SettingUpsertItem,
  SiteSettings,
} from "@/types/site-settings.types";

export interface SettingsFormValues {
  site_title: string;
  tagline: string;
  brand_color: string;
  meta_keywords: string;
  logo_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_embed_url: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
}

function mapSettingsToValues(settings: SiteSettings): SettingsFormValues {
  return {
    site_title: settings.general?.site_title ?? "",
    tagline: settings.general?.tagline ?? "",
    brand_color: settings.general?.brand_color ?? "#059669",
    meta_keywords: settings.general?.meta_keywords ?? "",
    logo_url: settings.general?.logo_url ?? settings.general?.logo_path ?? "",
    phone: settings.contact?.phone ?? "",
    whatsapp: settings.contact?.whatsapp ?? "",
    email: settings.contact?.email ?? "",
    address: settings.contact?.address ?? "",
    maps_embed_url: settings.contact?.maps_embed_url ?? "",
    instagram: settings.social?.instagram ?? "",
    facebook: settings.social?.facebook ?? "",
    linkedin: settings.social?.linkedin ?? "",
    tiktok: settings.social?.tiktok ?? "",
  };
}

function buildSettingsPayload(values: SettingsFormValues): SettingUpsertItem[] {
  const entries: [string, string, string][] = [
    ["general", "site_title", values.site_title],
    ["general", "tagline", values.tagline],
    ["general", "brand_color", values.brand_color],
    ["general", "meta_keywords", values.meta_keywords],
    ["general", "logo_url", values.logo_url],
    ["contact", "phone", values.phone],
    ["contact", "whatsapp", values.whatsapp],
    ["contact", "email", values.email],
    ["contact", "address", values.address],
    ["contact", "maps_embed_url", values.maps_embed_url],
    ["social", "instagram", values.instagram],
    ["social", "facebook", values.facebook],
    ["social", "linkedin", values.linkedin],
    ["social", "tiktok", values.tiktok],
  ];

  return entries.map(([group, key, value]) => ({
    group,
    key,
    value: value.trim() || null,
  }));
}

export interface UseSettingsFormReturn {
  methods: UseFormReturn<SettingsFormValues>;
  isSaving: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export function useSettingsForm(
  initialSettings: SiteSettings
): UseSettingsFormReturn {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<SettingsFormValues>({
    values: mapSettingsToValues(initialSettings),
  });

  const mutation = useMutation({
    mutationFn: async (values: SettingsFormValues) =>
      saveAdminSettingsAction({
        settings: buildSettingsPayload(values),
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
    onError: () => {
      toast.error("Terjadi kesalahan saat menyimpan pengaturan.");
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return {
    methods,
    isSaving: mutation.isPending,
    onSubmit: (e) => {
      void handleSubmit(e);
    },
  };
}
