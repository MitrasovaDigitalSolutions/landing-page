import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitesTable } from "@/features/auth/components/admin/sites-table";
import { UsersTable } from "@/features/auth/components/admin/users-table";
import {
  getAdminSites,
  getAdminUsers,
} from "@/features/auth/services/users.queries";
import { getAdminSession } from "@/lib/auth";
import { ShieldAlert } from "lucide-react";
import * as React from "react";

export const instant = false;

export default async function AdminUsersPage(): Promise<React.JSX.Element> {
  const session = await getAdminSession();

  if (!session?.user.isSuperadmin || !session.accessToken) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Unit Bisnis & Manajemen Admin"
          description="Kelola seluruh tenant unit usaha, akun admin, serta penugasan role per site."
        />
        <div className="mx-auto max-w-lg space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Akses Khusus Superadmin
          </h3>
          <p className="text-sm text-muted-foreground">
            Akun Anda tidak memiliki hak akses Superadmin untuk mengelola unit
            usaha dan pengguna.
          </p>
        </div>
      </div>
    );
  }

  const [usersResult, sitesResult] = await Promise.allSettled([
    getAdminUsers(session.accessToken),
    getAdminSites(session.accessToken),
  ]);

  const users = usersResult.status === "fulfilled" ? usersResult.value : [];
  const sites = sitesResult.status === "fulfilled" ? sitesResult.value : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Unit Bisnis & Manajemen Admin"
        description="Kelola daftar tenant unit usaha (sites), akun administrator, dan penugasan role per site."
      />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="users" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Pengguna & Akses Site ({users.length})
          </TabsTrigger>
          <TabsTrigger value="sites" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Unit Usaha / Tenant Sites ({sites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTable initialData={users} sites={sites} />
        </TabsContent>

        <TabsContent value="sites">
          <SitesTable sites={sites} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
