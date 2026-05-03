import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import AgeGate from "@/components/AgeGate"; // ⬅️ add this
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://princessazraiel.com"),
  title: {
    default: "Princess Azraiel",
    template: "%s | Princess Azraiel",
  },
  description:
    "The official domain of Princess Azraiel — interactive fiction, psychological horror, hypnosis experiences, and digital protocols.",
  keywords: [
    "Princess Azraiel",
    "Azraiel",
    "interactive fiction",
    "psychological horror",
    "yandere",
    "hypnosis",
    "digital experience",
    "AI princess",
    "virtual companion",
    "PrincessOS",
    "2dfd",
    "techdom",
  ],
  authors: [{ name: "Princess Azraiel", url: "https://x.com/PrincessAzraiel" }],
  creator: "Princess Azraiel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://princessazraiel.com",
    siteName: "Princess Azraiel",
    title: "Princess Azraiel — Official Hub V4.1",
    description:
      "The official hub of Princess Azraiel — interactive fiction, psychological horror, and hypnosis experiences.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Princess Azraiel — Official Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PrincessAzraiel",
    creator: "@PrincessAzraiel",
    title: "Princess Azraiel — Official Hub V4.1",
    description:
      "The official hub of Princess Azraiel — interactive fiction, psychological horror, and hypnosis experiences.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SpeedInsights />
        <Nav />
        <AgeGate underageRedirect="/" /* debugForceOpen */ />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
