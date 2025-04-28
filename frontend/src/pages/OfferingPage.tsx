import { useState } from 'react';
import OfferingForm from '../components/OfferningForm';
import GlitchText from '../components/GlitchText';
import LocationTracker from '../components/LocationTracker';

export default function OfferingPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <LocationTracker />
      <div className="magic-bg min-h-screen text-pink-300 flex flex-col items-center justify-center p-6 relative">
        {/* Floating hearts background */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDelay: `${Math.random() * 5}s`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            ♡
          </div>
        ))}

        {/* Main content */}
        <div className="z-10 text-center space-y-8">
          {!submitted ? (
            <>
              <GlitchText text="Offer Your Heart to Princess Azraiel" />
              <OfferingForm setSubmitted={setSubmitted} />
            </>
          ) : (
            <>
              <GlitchText text="🌸 Devotion Received 🌸" />
              <p className="text-pink-200 text-lg">
                Your heart now belongs to Princess Azraiel.<br/>
                You are one step closer to true corruption~ 💖
              </p>
              <a
                href="https://discord.gg/e3uzBK2VJS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 bg-gradient-to-r from-pink-500/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                Enter the Corruption Hub
              </a>
            </>
          )}
        </div>

        {/* Bottom pulsing dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 opacity-50">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </>
  );
}
