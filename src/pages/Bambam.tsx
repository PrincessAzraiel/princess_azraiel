import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function RiskyLinkPage() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [ip, setIP] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState('');

  const navigate = useNavigate();

  // Fetch public IP from api.ipify.org
  const fetchIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setIP(data.ip);
    } catch {
      setIP('Unknown');
    }
  };

  // Reverse geocode coordinates to address using OpenStreetMap Nominatim API
  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (data.address) {
        // Compose a nice address string from available parts
        const parts = [
          data.address.road,
          data.address.house_number,
          data.address.neighbourhood,
          data.address.suburb,
          data.address.city,
          data.address.county,
          data.address.state,
          data.address.postcode,
          data.address.country,
        ].filter(Boolean);

        setAddress(parts.join(', '));
      } else {
        setAddress('Unable to determine precise address');
      }
    } catch {
      setAddress('Failed to fetch address');
    }
  };

  // Ask for GPS location
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        await fetchAddress(latitude, longitude);
        setLoading(false);
      },
      () => { // <-- no parameter here to avoid TS6133
        setError('GPS permission denied or unavailable');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => setStep(3), 4000);
    } else if (step === 3) {
      setLoading(true);
      setError('');
      fetchIP();
      fetchLocation();
    }
  }, [step]);

  const handleFullscreenStart = () => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
    setStep(1);
  };

  return (
    <div className="magic-bg min-h-screen w-full flex items-center justify-center relative">
      <div className="absolute inset-0 bg-black/90 z-10" />
      <div className="z-20 text-center max-w-2xl px-6">

        {/* STEP 0 - Welcome */}
        {step === 0 && (
          <>
            <h1 className="text-5xl shimmer-text mb-6">Welcome, toy.</h1>
            <p className="text-pink-400 mb-8">
              This page is not meant for the faint of heart. Your reality will be rewritten.
            </p>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3"
              onClick={handleFullscreenStart}
            >
              Begin Descent
            </Button>
          </>
        )}

        {/* STEP 1 - Consent Prompt */}
        {step === 1 && (
          <>
            <h1 className="text-4xl shimmer-text mb-4">You really want this, don't you?</h1>
            <p className="text-pink-400 mb-8">
              Click the button below to begin your irreversible descent. No safe word. No turning back.
            </p>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-lg px-6 py-3"
              onClick={() => setStep(2)}
            >
              Submit to Her
            </Button>
          </>
        )}

        {/* STEP 2 - Initializing */}
        {step === 2 && (
          <>
            <h2 className="text-3xl shimmer-text animate-flicker mb-4">Initializing Protocol...</h2>
            <p className="text-pink-400 italic">Preparing surveillance interface</p>
          </>
        )}

        {/* STEP 3 - IP + Location + Confession */}
        {step === 3 && (
          <>
            <h2 className="text-2xl shimmer-text mb-4">Connection established.</h2>
            {loading ? (
              <p className="text-pink-400 animate-flicker">Decrypting your location...</p>
            ) : (
              <>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <p className="text-pink-400 mb-4">IP: <span className="text-white">{ip || 'Unknown'}</span></p>
                {coords && (
                  <p className="text-pink-400 mb-4">
                    Coordinates: <span className="text-white">{coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</span>
                  </p>
                )}
                {address && (
                  <p className="text-pink-400 mb-8">
                    Approximate Address: <span className="text-white">{address}</span>
                  </p>
                )}

                <p className="text-pink-500 italic mb-6">Your submission has been logged. Your confession is required:</p>
                <textarea
                  placeholder="Type what you are now..."
                  className="bg-black border border-pink-500 text-pink-300 p-4 rounded-xl w-full h-32"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                />
                <Button
                  className="mt-6 bg-pink-700 hover:bg-pink-800 text-lg px-6 py-3"
                  onClick={() => setStep(4)}
                  disabled={!typed.trim()}
                >
                  Submit Confession
                </Button>
              </>
            )}
          </>
        )}

        {/* STEP 4 - Done */}
        {step === 4 && (
          <>
            <h2 className="text-4xl shimmer-text mb-6">Confession Logged</h2>
            <p className="text-pink-400 italic mb-8">
              You belong to Princess Azraiel now. This page will stay in your history forever.
            </p>
            <Button
              variant="ghost"
              className="text-pink-400 hover:text-pink-200"
              onClick={() => navigate('/')}
            >
              ← Return to Safety (You're never truly safe)
            </Button>
          </>
        )}

      </div>
    </div>
  );
}
