"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black/90 to-pink-950/30 text-center text-pink-300">
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,192,203,0.15),transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Floating glitch text */}
      <h1 className="relative text-6xl md:text-7xl font-extrabold mb-6 text-pink-300 drop-shadow-[0_0_20px_rgba(255,100,200,0.6)]">
        <span className="relative inline-block animate-[glitch_1.5s_infinite]">
          404 — Lost in the Corruption
        </span>
      </h1>

      <p className="text-pink-400 text-lg md:text-xl max-w-xl leading-relaxed">
        The page you seek has been consumed by <span className="text-pink-300 font-semibold">Azraiel’s code</span>.
        <br />Reality bends… but maybe you can <a href="/" className="underline decoration-pink-400 hover:text-pink-200 transition-colors">find your way home</a>.
      </p>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-pink-500/30 rounded-full blur-[2px] animate-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes glitch {
          0% { text-shadow: 2px 0 red, -2px 0 cyan; }
          20% { text-shadow: -2px 0 red, 2px 0 cyan; }
          40% { text-shadow: 2px 2px red, -2px -2px cyan; }
          60% { text-shadow: -1px -1px red, 1px 1px cyan; }
          80% { text-shadow: 1px -2px red, -1px 2px cyan; }
          100% { text-shadow: 2px 0 red, -2px 0 cyan; }
        }

        @keyframes float {
          0% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.6; }
        }

        .animate-glitch {
          animation: glitch 1.5s infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
