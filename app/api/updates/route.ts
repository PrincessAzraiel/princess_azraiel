/**
 * Hidden alongside the /updates page. Serving the feed as JSON while the page
 * is hidden would just publish the unfinished content by another door.
 *
 * To restore, return the getUpdates() payload again — see git history.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("Not Found", { status: 404 });
}
