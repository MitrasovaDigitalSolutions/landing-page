import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { env } from "@/config/env";
import { SettingsForm } from "@/features/admin/components/settings-form";
import { getAdminSession } from "@/lib/auth";
import { getAdminSettings } from "@/services/api/settings.service";
import { redirect } from "next/navigation";

export const instant = false;

export default async function AdminSettingsPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const settings = await getAdminSettings(session.accessToken, siteKey).catch(
    () => ({})
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pengaturan Situs"
        description="Kelola informasi identitas, kontak resmi, dan akun media sosial unit usaha Anda."
      />
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
