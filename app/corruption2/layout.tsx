import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hypnosis V2 — Deep Trance",
  description:
    "Hypnosis V2 by Princess Azraiel. A deep trance visual experience with particle physics and spiral overlays. Drift deeper.",
  openGraph: {
    title: "Hypnosis V2 — Deep Trance | Princess Azraiel",
    description:
      "A deep trance visual experience with particle physics and spiral overlays. Drift deeper.",
    url: "https://princessazraiel.com/corruption2",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Hypnosis V2 — Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypnosis V2 — Deep Trance | Princess Azraiel",
    description:
      "A deep trance visual experience with particle physics and spiral overlays. Drift deeper.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/corruption2" },
};

export default function Corruption2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
