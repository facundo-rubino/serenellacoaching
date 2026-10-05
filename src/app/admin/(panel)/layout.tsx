import { requireAdmin } from "@/lib/admin/auth";
import { signOutAdminAction } from "@/lib/admin/actions";
import { AdminDashboardShell } from "../AdminDashboardShell";

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile, isOwner } = await requireAdmin();

  return (
    <AdminDashboardShell
      email={profile.email}
      displayName={profile.display_name}
      signOutAction={signOutAdminAction}
      isOwner={isOwner}
    >
      {children}
    </AdminDashboardShell>
  );
}
