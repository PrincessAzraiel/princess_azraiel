// Central data source for updates

export type Update = {
  id: string;
  date: string; // ISO
  title: string;
  body: string; // plain text (short)
  tags?: string[];
  status?: "released" | "in-progress" | "planned" | "fix" | "breaking";
  // Rich content (optional)
  link?: { label: string; href: string };
  image?: string;           // single hero image (/public path or URL)
  gallery?: string[];       // up to 4 thumbs
};

const seed: Update[] = [
  {
    id: "2025-11-06-loveprotocol-hero",
    date: "2025-11-06T18:30:00Z",
    title: "LoveProtocol — session reconnect feels instant",
    body:
      "Introduced soft resume for tab-switch / mobile wake. Sessions bind faster and preserve the emotional thread without re-asking context.",
    tags: ["programs", "ux"],
    status: "released",
    image: "/updates/loveprotocol-reconnect.jpg",
    link: { label: "Try the new flow", href: "/love" },
  },
  {
    id: "2025-11-02-winterprotocol-announce",
    date: "2025-11-02T12:00:00Z",
    title: "Winter Protocol — Dec 1 preview",
    body:
      "Teaser modules landed; day selector UI and local save are in QA. First drop focuses on ambience, warmth and light puzzle beats.",
    tags: ["roadmap", "programs"],
    status: "in-progress",
    gallery: [
      "/updates/winter/teaser-1.jpg",
      "/updates/winter/teaser-2.jpg",
      "/updates/winter/teaser-3.jpg",
      "/updates/winter/teaser-4.jpg",
    ],
    link: { label: "Preview page", href: "/winter" },
  },
  {
    id: "2025-10-29-site-ux",
    date: "2025-10-29T09:10:00Z",
    title: "Site pass — faster nav, crisper OG",
    body:
      "Navigation latency trimmed, focus states tuned, and fresh open-graph images for /updates so shares look great everywhere.",
    tags: ["site"],
    status: "fix",
  },
];

export function getUpdates(): Update[] {
  // newest first
  return [...seed].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
