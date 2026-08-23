import { redirect } from "next/navigation";
import { requireSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminProfile } from "./types";

type AdminGuardOptions = {
  requireMfa?: boolean;
};

export async function requireAdmin(options: AdminGuardOptions = {}) {
  const requireMfa = options.requireMfa ?? true;
  const supabase = await requireSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const providers = Array.isArray(user.app_metadata.providers) ? user.app_metadata.providers : [];

  if (!providers.includes("google")) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=google_required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,display_name,role")
    .eq("id", user.id)
    .single<AdminProfile>();

  if (profileError || profile?.role !== "admin") {
    redirect("/admin/login?error=unauthorized");
  }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (requireMfa) {
    if (aal?.nextLevel !== "aal2") {
      redirect("/admin/mfa/enroll");
    }

    if (aal.currentLevel !== "aal2") {
      redirect("/admin/mfa/challenge");
    }
  }

  return { supabase, user, profile, aal };
}
