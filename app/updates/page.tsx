// app/updates/page.tsx
import type { Metadata } from "next";
import UpdatesClient from "./UpdatesClient";

export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: "Princess Azraiel - Updates & Roadmap",
    description:
        "Stay updated with the latest programs, improvements, and future plans for Princess Azraiel's kingdom. Follow her development journey and upcoming releases.",
    openGraph: {
        title: "Princess Azraiel - Updates & Roadmap",
        description:
            "Discover what's new and what's coming next in Princess Azraiel's kingdom. Regular updates and future development plans.",
        type: "website",
        url: "https://princessazraiel.com/updates",
        images: [{ url: "/updates/og.jpg", width: 1080, height: 1350, alt: "Updates & Roadmap" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Princess Azraiel - Updates & Roadmap",
        description:
            "Discover what's new and what's coming next in Princess Azraiel's kingdom. Regular updates and future development plans.",
        images: ["/updates/og.png"],
    },
    alternates: { canonical: "https://princessazraiel.com/updates" },
};

export default function Page() {
  return <UpdatesClient />;
}
