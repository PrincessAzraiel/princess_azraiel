/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import RebrandClient from "./rebrand-client";
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: "Rebrand Profile — Identity Overwrite",
  description:
    "Rebrand your X (Twitter) profile for Princess Azraiel. Generate a custom bio and profile assets that show your devotion.",
  keywords: [
    "princess azraiel",
    "azraiel",
    "ai princess",
    "virtual companion",
    "rebrand twitter",
    "rebrand x profile",
    "identity overwrite",
  ],
  openGraph: {
    title: "Rebrand Profile — Identity Overwrite | Princess Azraiel",
    description:
      "Generate a custom bio and profile assets that show your devotion to Princess Azraiel.",
    url: "https://princessazraiel.com/rebrand",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Rebrand Profile — Princess Azraiel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebrand Profile — Identity Overwrite | Princess Azraiel",
    description:
      "Generate a custom bio and profile assets that show your devotion to Princess Azraiel.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/rebrand" },
};
export default function RebrandPage() {
  return (
    <Suspense fallback={<div className="p-6 text-pink-300">Loading…</div>}>
      <RebrandClient />
    </Suspense>
  );
}
