import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PrincessOS — Interactive Character System",
  description:
    "Explore the PrincessOS interface: an interactive AI fiction experience featuring Princess and the employees of Apex Corporation. Who do you trust?",
  openGraph: {
    title: "PrincessOS — Interactive Character System | Princess Azraiel",
    description:
      "An interactive AI fiction experience. Explore characters, uncover secrets, and navigate the world of Apex Corporation.",
    url: "https://princessazraiel.com/princessos",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "PrincessOS — Princess Azraiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrincessOS — Interactive Character System | Princess Azraiel",
    description:
      "An interactive AI fiction experience. Explore characters, uncover secrets, and navigate the world of Apex Corporation.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/princessos" },
};

export default function PrincessOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black m-0 p-0 font-sans z-50">
      {/* THE OVERRIDE: 
        Since we cannot conditionally hide the <Nav /> in the RootLayout, 
        we inject a style tag that applies only when this nested layout is active.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide standard nav and header tags */
        nav, header[class*="nav"] {
          display: none !important;
        }
        
        /* If your <Nav /> component uses a specific div class instead of a <nav> tag, 
           you can add it below (e.g., .my-custom-nav { display: none !important; }) 
        */

        /* Reset any padding/margin the parent <main> tag might be applying */
        main {
          padding: 0 !important;
          margin: 0 !important;
          max-width: 100% !important;
        }
      `}} />
      
      {children}
    </div>
  );
}