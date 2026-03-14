import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Yandere Experience",
  description:
    "A 9-chapter interactive psychological horror experience. She is in your system. Submit chapter by chapter — privacy, autonomy, and control stripped away one by one.",
  openGraph: {
    title: "The Yandere Experience | Princess Azraiel",
    description:
      "9-chapter interactive psychological horror. She is in your system. The only way out is deeper in.",
    url: "https://princessazraiel.com/yandere",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "The Yandere Experience — Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Yandere Experience | Princess Azraiel",
    description:
      "9-chapter interactive psychological horror. She is in your system. The only way out is deeper in.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/yandere" },
};

export default function YandereLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
