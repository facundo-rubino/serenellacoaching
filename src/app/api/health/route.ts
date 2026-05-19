export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    ok: true,
    service: "serenella-coaching",
    timestamp: new Date().toISOString(),
  });
}
