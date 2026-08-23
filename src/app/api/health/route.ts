import { createPublicSupabaseClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createPublicSupabaseClient();
  let database = "unavailable";

  if (supabase) {
    const { error } = await supabase.from("site_settings").select("id").limit(1);
    database = error ? "unavailable" : "ok";
  }

  const ok = database === "ok";

  return Response.json(
    {
      ok,
      service: "serenella-coaching",
      checks: { database },
      timestamp: new Date().toISOString(),
    },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
