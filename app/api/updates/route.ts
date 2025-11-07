import { getUpdates } from "@/app/updates/updates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const updates = getUpdates();
  return new Response(JSON.stringify({ updates }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
