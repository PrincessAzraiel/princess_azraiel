import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Coffee, Gift, Bird, Send, Users, Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-pink-100">
      {/* Soft animated gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_10%,#ff7ad6,transparent_60%),radial-gradient(900px_500px_at_90%_20%,#9b5cff,transparent_55%),radial-gradient(800px_600px_at_50%_100%,#2dd4bf,transparent_60%)] opacity-40" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Floating hearts */}
      <Hearts />

      {/* Content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-14">
        <section className="w-full max-w-3xl">
          {/* Header card */}
          <div className="rounded-3xl border border-pink-400/20 bg-black/40 shadow-[0_0_60px_-15px_rgba(255,105,235,0.6)] backdrop-blur-xl p-8 md:p-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-300/20 bg-pink-300/10 px-4 py-1 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="tracking-wide">A Digital Goddess Experience</span>
            </div>

            <h1 className="text-center text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-pink-300 via-white to-pink-300 bg-clip-text text-transparent animate-[shine_5s_linear_infinite]">
                Princess Azraiel&apos;s Corruption Hub
              </span>
            </h1>
            <p className="mt-4 text-center text-lg md:text-xl italic text-pink-200/90">
              Submit. Suffer. Smile.
            </p>

            {/* Primary CTAs */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link href="/corruption">
                <Button className="w-full h-12 rounded-2xl text-lg font-semibold shadow-lg shadow-pink-500/30 transition hover:shadow-pink-400/50 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500">
                  <Heart className="mr-2 h-5 w-5" />
                  Begin Your Corruption
                </Button>
              </Link>

              <Link href="/corruption2">
                <Button className="w-full h-12 rounded-2xl text-lg font-semibold border border-pink-300/30 bg-black/30 hover:bg-black/40">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Enter Hypnosis (v2)
                </Button>
              </Link>

              {/* NEW: Rebrand route */}
              <Link href="/rebrand" className="sm:col-span-2">
                <Button className="w-full h-12 rounded-2xl text-lg font-semibold bg-pink-500/20 hover:bg-pink-500/30 border border-pink-300/30 relative">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Rebrand Your X Profile
                  <span className="absolute -top-2 -right-2 rounded-full bg-fuchsia-500 text-white text-[10px] px-2 py-0.5 shadow-md">
                    NEW
                  </span>
                </Button>
              </Link>

              <Link href="/programs" className="sm:col-span-2">
                <Button className="w-full h-12 rounded-2xl text-lg font-semibold bg-pink-400/20 hover:bg-pink-400/30 border border-pink-300/30">
                  Explore Programs
                </Button>
              </Link>
            </div>

            {/* Social / External */}
            <div className="mt-8">
              <p className="mb-3 text-center text-sm tracking-wide text-pink-200/80">
                Connect, support, and worship:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="https://x.com/PrincessAzraiel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="w-full h-11 rounded-2xl justify-start bg-black/30 hover:bg-black/40 border border-white/10"
                    variant="secondary"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    X (Twitter)
                  </Button>
                </a>

                <a
                  href="https://bsky.app/profile/princess-azraiel.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="w-full h-11 rounded-2xl justify-start bg-black/30 hover:bg-black/40 border border-white/10"
                    variant="secondary"
                  >
                    <Bird className="mr-2 h-5 w-5" />
                    Bluesky
                  </Button>
                </a>

                <a
                  href="https://throne.com/princessazraiel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="w-full h-11 rounded-2xl justify-start bg-black/30 hover:bg-black/40 border border-white/10"
                    variant="secondary"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Send a Gift (Throne)
                  </Button>
                </a>

                <a
                  href="https://ko-fi.com/princessazraiel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="w-full h-11 rounded-2xl justify-start bg-black/30 hover:bg-black/40 border border-white/10"
                    variant="secondary"
                  >
                    <Coffee className="mr-2 h-5 w-5" />
                    Buy Me a Coffee
                  </Button>
                </a>

                <a
                  href="https://discord.gg/e3uzBK2VJS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-2"
                >
                  <Button className="w-full h-11 rounded-2xl justify-center bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-300/30">
                    <Users className="mr-2 h-5 w-5" />
                    Join the Discord
                  </Button>
                </a>
              </div>
            </div>

            {/* Tiny footnote */}
            <p className="mt-8 text-center text-xs text-pink-200/70">
              Consent is sacred. Take breaks, hydrate, and enjoy responsibly. ♡
            </p>
          </div>
        </section>
      </main>

      {/* Local styles for shimmer + hearts */}
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .heart {
          position: absolute;
          filter: drop-shadow(0 6px 18px rgba(255, 105, 235, 0.35));
          opacity: 0.9;
          user-select: none;
          pointer-events: none;
          animation: floatUp linear infinite, sway ease-in-out infinite;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: .0; }
          10% { opacity: .9; }
          100% { transform: translateY(-110vh) scale(1.05); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
      `}</style>
    </div>
  );
}

/** Lightweight floating hearts (no external assets) */
function Hearts() {
  const hearts = Array.from({ length: 14 }).map((_, i) => {
    const left = Math.random() * 100;               // vw
    const delay = Math.random() * 6;                // s
    const duration = 12 + Math.random() * 10;       // s
    const size = 16 + Math.random() * 18;           // px
    const hueRotate = `hue-rotate(${Math.floor(Math.random() * 24) - 12}deg)`;
    return { left, delay, duration, size, hueRotate, i };
  });

  return (
    <div aria-hidden className="absolute inset-0">
      {hearts.map(({ left, delay, duration, size, hueRotate, i }) => (
        <div
          key={i}
          className="heart"
          style={{
            left: `${left}vw`,
            bottom: '-6vh',
            animationDuration: `${duration}s, ${6 + (i % 5)}s`,
            animationDelay: `${delay}s, ${delay / 2}s`,
            filter: `drop-shadow(0 6px 18px rgba(255,105,235,0.35)) ${hueRotate}`,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className="opacity-80"
            fill="url(#g)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff7ad6" />
                <stop offset="100%" stopColor="#ffd1ef" />
              </linearGradient>
            </defs>
            <path d="M12 21s-6.716-4.494-9.293-7.07a6.571 6.571 0 0 1 9.293-9.293 6.571 6.571 0 0 1 9.293 9.293C18.716 16.506 12 21 12 21z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
