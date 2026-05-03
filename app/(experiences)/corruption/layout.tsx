import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Initiate Corruption",
  description:
    "The Standard Protocol. An immersive visual corruption experience by Princess Azraiel. Enter and let it begin.",
  openGraph: {
    title: "Initiate Corruption | Princess Azraiel",
    description:
      "The Standard Protocol. An immersive visual corruption experience. Enter and let it begin.",
    url: "https://princessazraiel.com/corruption",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Initiate Corruption — Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Initiate Corruption | Princess Azraiel",
    description:
      "The Standard Protocol. An immersive visual corruption experience. Enter and let it begin.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/corruption" },
};

export default function CorruptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
