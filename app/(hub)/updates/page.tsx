import { notFound } from "next/navigation";

/**
 * Hidden until the updates feed is ready.
 *
 * The route 404s rather than redirecting or showing a placeholder, so the
 * unfinished feed isn't reachable by guessing the URL. Everything needed to
 * bring it back is still here: the seed data in ./updates.ts and the reader
 * in ./UpdatesClient.tsx. To restore, delete this file's notFound() and
 * render <UpdatesClient />, then re-add `updates` to routes in lib/links.ts.
 *
 * Note the seed data's newest entry is from Nov 2025 — refresh it before
 * putting this in front of anyone, or the feed will read as abandoned.
 */
export default function Page() {
  notFound();
}
