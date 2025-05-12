import { useEffect, useState, useRef } from 'react';

const imageCount = 88;
const glitchTexts = [
  'SUBMIT', 'CORRUPT', 'OBEY', 'PRINCESS', 'OFFER MORE', 
  'NO ESCAPE', 'AZRAIEL', 'GLITCHED', '💗'
];

type GlitchImage = {
  id: number;
  src: string;
  style: React.CSSProperties;
};

export default function CorruptionRainPage() {
  const [images, setImages] = useState<GlitchImage[]>([]);
  const [flashText, setFlashText] = useState<string | null>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlashText(null);
      setCurrentTextIndex(prev => (prev + 1) % glitchTexts.length);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentTextIndex]);

  // Set current text when index changes
  useEffect(() => {
    setFlashText(glitchTexts[currentTextIndex]);
  }, [currentTextIndex]);

  // Image creation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const isDesktop = window.innerWidth > 768;
      
    const newImage: GlitchImage = {
      id,
      src: `/corrupt/${Math.floor(Math.random() * imageCount) + 1}.png`,
      style: {
        position: 'absolute',
        top: `${Math.random() * 90}vh`,
        left: `${Math.random() * 90}vw`,
        width: `${isDesktop 
        ? 300 + Math.random() * 200  // 300–500px for desktops
        : 100 + Math.random() * 80   // 100–180px for phones
        }px`,
        opacity: 0.8,
        transform: `rotate(${Math.random() * 30 - 15}deg)`,
        filter: 'drop-shadow(0 0 10px pink)',
        transition: 'opacity 1s ease-out',
      }
    };
      
      
      setImages(prev => [...prev, newImage]);

      setTimeout(() => {
        setImages(prev => prev.filter(img => img.id !== id));
      }, 4000);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.play();
      setAudioStarted(true);
    }
  };

  return (
    <div
      className="magic-bg min-h-screen w-full relative overflow-hidden text-pink-300 font-bold text-xl"
      onClick={startAudio}
      onTouchStart={startAudio}
    >
      <audio ref={audioRef} src="/audio/glitch.mp3" loop preload="auto" />

      {images.map(img => (
        <img key={img.id} src={img.src} style={img.style} />
      ))}

      {flashText && (
        <div
          className="glitch-text"
          style={{
            position: 'absolute',
            top: '45vh',
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: '10vw',
            animation: 'flash 2s ease-in-out',
            color: '#ff69eb',
            opacity: 0.6,
            textShadow: '0 0 5px #ff69eb, 0 0 10px #ff69eb',
            pointerEvents: 'none',
          }}
        >
          {flashText}
        </div>
      )}

      <style>{`
        @keyframes flash {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        .glitch-text {
          font-weight: 900;
          font-family: 'Arial Black', sans-serif;
        }
      `}</style>
    </div>
  );
}