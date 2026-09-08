/**
 * Server-side proxy for the backend's Discord relay.
 *
 * The browser used to POST straight to `<backend>/wh`, which meant the route
 * could not be protected by a shared secret — anything shipped to the client
 * is public. Client code now posts here instead, and this route (which runs on
 * the server) adds the secret the backend requires. WH_SECRET must never be
 * exposed with a NEXT_PUBLIC_ prefix.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.princessazraiel.com";

// Matches the backend's express.json({ limit: "2mb" }) so oversized payloads
// are rejected here rather than after a pointless round trip.
const MAX_BODY_BYTES = 2 * 1024 * 1024;

export async function POST(req: Request) {
  const secret = process.env.WH_SECRET;
  if (!secret) {
    console.error("[api/wh] WH_SECRET is not configured");
    return Response.json({ error: "Server not configured" }, { status: 503 });
  }

  const body = await req.text();
  if (body.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const upstream = await fetch(`${BACKEND_URL}/wh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WH-SECRET": secret,
      },
      body,
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/wh] upstream request failed:", err);
    return Response.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
