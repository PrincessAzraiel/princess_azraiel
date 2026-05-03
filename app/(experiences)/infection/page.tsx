// app/infection/page.tsx
import type { Metadata } from "next";
import PreOrderPageClient from "./PreOrderClient";

export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Princess's Infection Protocol — Final Release",
  description:
    "A multi-persona Discord experience that drips attention 24/7. Choose your personas, and let the Infection Protocol orchestrate messages, images, and prompts.",
  openGraph: {
    title: "Princess's Infection Protocol — Final Release",
    description:
      "Nine distinct AI personas, DLC packs, and full flood control. Runs on your Discord—no install required.",
    type: "website",
    url: "https://princessazraiel.com/infection",
    images: [{ url: "/infection/og.jpg", width: 1200, height: 630, alt: "Infection Protocol" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Princess's Infection Protocol — Final Release",
    description:
      "Nine distinct AI personas, DLC packs, and full flood control. Runs on your Discord—no install required.",
    images: ["/infection/og.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/infection" },
};

export default function Page() {
  return <PreOrderPageClient />;
}
