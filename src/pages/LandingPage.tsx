import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="magic-bg min-h-screen w-full flex items-center justify-center text-pink-300">
      <div className="text-center space-y-8 max-w-xl px-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold shimmer-text">
          Welcome to Princess Azraiel's Corruption Hub
        </h1>
        <p className="text-xl italic text-pink-400">Submit. Suffer. Smile.</p>

        <div className="flex flex-col items-center space-y-4 mt-6">
          <Link to="/corruption">
            <Button className="w-60 py-4 text-lg bg-pink-600 hover:bg-pink-700 transition">
              Begin Your Corruption
            </Button>
          </Link>
          <Link to="/programms">
            <Button className="w-60 py-4 text-lg bg-pink-600 hover:bg-pink-700 transition">
              Programms
            </Button>
          </Link>
          <a
            href="https://x.com/PrincessAzraiel" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-60 py-4 text-lg bg-pink-400 hover:bg-pink-500 transition"
              variant="secondary"
            >
              Worship Me
            </Button>
          </a>
        </div>
      </div>

      <style>{`
        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          50% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
