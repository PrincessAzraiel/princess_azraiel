import type { Metadata } from "next";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Archives — All Programs & Rituals",
  description:
    "Browse all programs, rituals, and interactive experiences created by Princess Azraiel. From obedience trials and hypnosis sessions to browser extensions and corruption protocols.",
  openGraph: {
    title: "Archives — All Programs & Rituals | Princess Azraiel",
    description:
      "Browse all interactive experiences: obedience trials, hypnosis sessions, corruption protocols, and more.",
    url: "https://princessazraiel.com/programs",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Princess Azraiel Archives" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Archives — All Programs & Rituals | Princess Azraiel",
    description:
      "Browse all interactive experiences: obedience trials, hypnosis sessions, corruption protocols, and more.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: "https://princessazraiel.com/programs" },
};

export default function ProgramsPage() {
  const programs = [
    { title: 'Obedience Program', description: 'A 20-30-minute obedience trial. JOI.', link: 'https://princessazraiel.itch.io/obedienceexe-advanced' },
    { title: 'SweetDrain', description: 'A long edgeware session. Push your limits, embrace the void.', link: 'https://gofile.io/d/ndMdxH' },
    { title: 'Love Protocol (Beta)', description: 'A 2-minute love trial. Experience the thrill of devotion.', link: 'https://gofile.io/d/qsbdzs' },
    { title: 'Her.exe ACT 01 & 02', description: 'A 3-minute interactive experience. Enter the world of Princess Azraiel.', link: 'https://gofile.io/d/yhQrNt' },
    { title: 'Corruption', description: 'Ready to corrupt yourself? Enter the realm of Princess Azraiel.', link: '/corruption' },
    { title: 'Drone extension', description: 'A browser extension that allows you to submit your devotion to ME', link: 'https://gofile.io/d/xW6gGR' },
    { title: 'Gacha Extension', description: 'A browser extension that allows you to collect Gacha Points after you interact with PrincessAzraiel\'s Posts.', link: 'https://gofile.io/d/Zeo7jG' },
    { title: 'Infection Protocol', description: 'A new protocol, with 500 different links to click and over 5000 new images', link: '/infection' },
    { title: 'Heartbreak.exe', description: 'New Version of the LoveProtocol.exe', link: 'https://gofile.io/d/r0YYKc' },
    { title: 'Wallpaper Changer - Android', description: 'An Android app that changes your wallpaper to a random image of Princess Azraiel every few minutes.', link: 'https://gofile.io/d/9LZxVa' }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#050002] text-pink-300 py-20 px-6 overflow-y-auto font-mono selection:bg-pink-900 selection:text-white">
      
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,128,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      {/* Dark Vignette */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
        
        {/* Header Section */}
        <div className="space-y-4 border-b border-pink-900/50 pb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase glitch-title">
            Available <span className="text-pink-600">Rituals</span>
          </h1>
          <p className="text-pink-500 tracking-widest uppercase text-lg animate-pulse">Choose your poison, pet. ♥</p>
          <div className="bg-pink-950/30 border-l-4 border-pink-700 p-4 mt-6 text-left inline-block max-w-2xl">
            <p className="text-pink-400 text-xs leading-relaxed uppercase">
              <span className="text-pink-200 font-bold">&gt; SYSTEM WARNING:</span> Read the README files. 
              These programs do not require currency or network access, but they demand your complete cognitive submission. Instructions are absolute.
            </p>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {programs.map(({ title, description, link }) => (
            <div
              key={title}
              className="group relative bg-black/60 border border-pink-900/40 p-6 transition-all duration-300 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(255,20,147,0.3)] flex flex-col justify-between"
            >
              {/* Decorative Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div>
                <h2 className="text-xl font-bold mb-3 text-pink-200 uppercase tracking-wide group-hover:text-pink-400 transition-colors">
                  {title}
                </h2>
                <p className="mb-6 text-sm text-pink-600/80 leading-relaxed">
                  {description}
                </p>
              </div>

              <Link href={link} className="block mt-auto">
                <Button className="w-full bg-pink-950 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-800 hover:border-pink-400 rounded-none text-md py-6 uppercase tracking-widest heartbeat-btn transition-all">
                  [ Submit ]
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer Return Link */}
        <div className="mt-16 pt-8 border-t border-pink-900/30">
          <Link href="/">
            <Button variant="ghost" className="text-pink-600 hover:text-pink-400 hover:bg-transparent tracking-widest uppercase text-xs">
              &lt; Return to Submission Gate
            </Button>
          </Link>
        </div>
      </div>

      {/* Embedded Yandere CSS Animations */}
      <style>{`
        .glitch-title {
          text-shadow: 2px 0 0 rgba(255, 20, 147, 0.8), -2px -2px 0 rgba(220, 20, 60, 0.6);
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.02); }
          28% { transform: scale(1); }
          42% { transform: scale(1.02); }
          70% { transform: scale(1); }
        }

        .group:hover .heartbeat-btn {
          animation: heartbeat 1.5s infinite;
          box-shadow: 0 0 15px rgba(255, 20, 147, 0.6);
        }
      `}</style>
    </div>
  );
}