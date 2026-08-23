import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

export function createPublicSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
