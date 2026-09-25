import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import AzraTokFeed, { type FeedItem, type MediaKind } from "./AzraTokFeed";

export const metadata: Metadata = {
  title: "AzraTok",
  description: "Scroll the feed. Princess Azraiel's clips, one after another.",
};

// Everything dropped into public/AzraTok shows up in the feed. The folder is
// read when the page is built, so new files appear on the next deploy.
const MEDIA_DIR = path.join(process.cwd(), "public", "AzraTok");

const EXTENSIONS: Record<MediaKind, string[]> = {
  video: [".mp4", ".mov", ".m4v", ".webm", ".ogv", ".mkv", ".avi", ".3gp"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".bmp", ".svg", ".heic", ".heif", ".jfif"],
  audio: [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".oga", ".flac", ".opus"],
  document: [".pdf", ".txt", ".html", ".htm"],
  other: [],
};

function kindOf(file: string): MediaKind {
  const ext = path.extname(file).toLowerCase();
  for (const kind of Object.keys(EXTENSIONS) as MediaKind[]) {
    if (EXTENSIONS[kind].includes(ext)) return kind;
  }
  return "other";
}

// Share links point at a post by this code instead of its file name. It comes
// from the name, so a link keeps working as long as the file isn't renamed.
function linkId(name: string) {
  return createHash("sha256").update(name).digest("base64url").slice(0, 8);
}

async function loadFeed(): Promise<FeedItem[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(MEDIA_DIR);
  } catch {
    return [];
  }

  return entries
    .filter((name) => !name.startsWith(".") && name !== "Thumbs.db" && name !== "desktop.ini")
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => ({
      id: linkId(name),
      name,
      src: `/AzraTok/${encodeURIComponent(name)}`,
      kind: kindOf(name),
      ext: path.extname(name).slice(1).toLowerCase(),
    }));
}

export default async function AzraTokPage() {
  const items = await loadFeed();
  return <AzraTokFeed items={items} />;
}
