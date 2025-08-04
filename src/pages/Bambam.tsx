import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function RiskyLinkPage() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullscreenError, setFullscreenError] = useState('');

  const [ip, setIP] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');

  const navigate = useNavigate();

  // Enhanced fullscreen function with mobile support
  const requestFullscreen = async () => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      webkitEnterFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) { // Chrome, Safari, Opera
        await el.webkitRequestFullscreen();
      } else if (el.webkitEnterFullscreen) { // iOS Safari
        await el.webkitEnterFullscreen();
      } else if (el.mozRequestFullScreen) { // Firefox
        await el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) { // IE/Edge
        await el.msRequestFullscreen();
      } else {
        setFullscreenError('Fullscreen not supported on this device');
      }
    } catch (err) {
      setFullscreenError('Failed to enter fullscreen mode');
      console.error('Fullscreen error:', err);
    }
  };

  // Fetch public IP from multiple fallback services
  const fetchIP = async () => {
    try {
      // Try ipify first
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      if (data.ip) {
        setIP(data.ip);
        return;
      }
      throw new Error('No IP returned');
    } catch {
      try {
        // Fallback to icanhazip
        const res = await fetch('https://icanhazip.com');
        const ip = await res.text();
        setIP(ip.trim());
      } catch {
        setIP('Unknown');
      }
    }
  };

  // Reverse geocode coordinates to address with multiple fallbacks
  const fetchAddress = async (lat: number, lon: number) => {
    try {
      // Try OpenStreetMap first
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const osmData = await osmRes.json();
      
      if (osmData.address) {
        const parts = [
          osmData.address.road,
          osmData.address.house_number,
          osmData.address.neighbourhood,
          osmData.address.suburb,
          osmData.address.city,
          osmData.address.county,
          osmData.address.state,
          osmData.address.postcode,
          osmData.address.country,
        ].filter(Boolean);

        setAddress(parts.join(', '));
        return;
      }
      throw new Error('No address from OSM');
    } catch {
      try {
        // Fallback to BigDataCloud
        const bdcRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const bdcData = await bdcRes.json();
        
        if (bdcData.locality) {
          setAddress(`${bdcData.locality}, ${bdcData.principalSubdivision}, ${bdcData.countryName}`);
        } else {
          setAddress('Approximate location only');
        }
      } catch {
        setAddress('Location detected but address unavailable');
      }
    }
  };

  // Get browser and device info
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('Trident')) browser = 'Internet Explorer';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    
    const mobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua);
    
    setBrowserInfo(`${browser} on ${mobile ? 'Mobile' : 'Desktop'}`);
  };

  // Ask for GPS location with enhanced options
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
      (err) => {
        setError(`GPS ${err.message.toLowerCase()}`);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getBrowserInfo();
    
    if (step === 2) {
      setTimeout(() => setStep(3), 4000);
    } else if (step === 3) {
      setLoading(true);
      setError('');
      fetchIP();
      fetchLocation();
    }
  }, [step]);

  const handleFullscreenStart = async () => {
    await requestFullscreen();
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
            {fullscreenError && (
              <p className="text-red-400 mb-4">{fullscreenError}</p>
            )}
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
                <p className="text-pink-400 mb-2">Device: <span className="text-white">{browserInfo}</span></p>
                <p className="text-pink-400 mb-2">IP: <span className="text-white">{ip || 'Unknown'}</span></p>
                {coords && (
                  <>
                    <p className="text-pink-400 mb-2">
                      Coordinates: <span className="text-white">{coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</span>
                    </p>
                    <p className="text-pink-400 mb-4">
                      <a 
                        href={`https://www.google.com/maps?q=${coords.lat},${coords.lon}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white underline hover:text-pink-200"
                      >
                        View on Google Maps
                      </a>
                    </p>
                  </>
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