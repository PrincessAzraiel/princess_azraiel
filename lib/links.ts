/**
 * Every off-site link in one place.
 *
 * Import from here instead of pasting URLs into pages:
 *
 *   import { links } from "@/lib/links";
 *   <a href={links.discord}>Join the Discord</a>
 *
 * When something moves — a new Discord invite, a renamed Throne — change it
 * once here and every page follows. Pages that hardcode a URL are the reason
 * four different Discord invites were live at the same time.
 */

export const site = {
  url: "https://princessazraiel.com",
  /** Backend API. First-party subdomain, so session cookies aren't third-party. */
  api: "https://api.princessazraiel.com",
  /** X handle without the @. */
  handle: "PrincessAzraiel",
} as const;

export const links = {
  // ── Social ──────────────────────────────────────────────────────────
  x: "https://x.com/PrincessAzraiel",
  bluesky: "https://bsky.app/profile/princess-azraiel.bsky.social",

  /**
   * The canonical invite, confirmed by hand.
   *
   * Four others are still hardcoded in individual pages — sCusdWXxZF,
   * j6pCbYRJJ5, BVkbrgYbRR and e3uzBK2VJS — and none of them is this one.
   * Point those pages here and delete them.
   */
  discord: "https://discord.gg/PxsYU5utwS",

  // ── Support & storefronts ───────────────────────────────────────────
  throne: "https://throne.com/princessazraiel",
  kofi: "https://ko-fi.com/princessazraiel",
  itch: "https://princessazraiel.itch.io/",
  patreon: "https://www.patreon.com/cw/PrincessAzraiel",
  steamWishlist:
    "https://store.steampowered.com/wishlist/profiles/76561199854908095/",
} as const;

export type LinkKey = keyof typeof links;

/** Internal routes, so a typo is a build error rather than a dead link. */
export const routes = {
  home: "/",
  // Experiences
  infection: "/infection",
  yandere: "/yandere",
  amae: "/amae",
  corruption: "/corruption",
  corruption2: "/corruption2",
  princessos: "/princessos",
  projectos: "/projectos",
  ascension: "/ascension",
  comic: "/comic",
  sessions: "/sessions",
  rebrand: "/rebrand",
  claimed: "/claimed",
  // Hub
  programs: "/programs",
  // updates: "/updates",  // hidden until the feed is ready - see app/(hub)/updates/page.tsx
  links: "/links",
  contract: "/contract",
  preOrder: "/pre-order",
  wheels: "/wheels/sissy",
  // Legal
  terms: "/terms",
  privacy: "/privacy",
  report: "/report",
} as const;

export type RouteKey = keyof typeof routes;

/** Absolute URL for a route — for OG tags, canonicals and share links. */
export function absolute(path: string): string {
  return new URL(path, site.url).toString();
}

/**
 * A pre-filled X composer.
 *
 * Note X counts every URL as 23 characters regardless of length, so a longer
 * path costs nothing against the 280 limit.
 */
export function shareOnX(text: string, url?: string): string {
  const body = url ? `${text} ${absolute(url)}` : text;
  return `https://x.com/intent/post?text=${encodeURIComponent(body)}`;
}

/**
 * Rendering-ready social list. Derived from `links` so the two can't disagree;
 * `icon` is a name for the page to map to its own icon set, keeping this file
 * free of component imports.
 */
export const socials = [
  { key: "x", label: "X", href: links.x, icon: "send" },
  { key: "bluesky", label: "Bluesky", href: links.bluesky, icon: "bird" },
  { key: "discord", label: "Discord", href: links.discord, icon: "globe" },
  { key: "throne", label: "Throne", href: links.throne, icon: "gift" },
  { key: "kofi", label: "Ko-fi", href: links.kofi, icon: "coffee" },
  { key: "itch", label: "itch.io", href: links.itch, icon: "gamepad" },
] as const satisfies ReadonlyArray<{
  key: LinkKey;
  label: string;
  href: string;
  icon: string;
}>;
