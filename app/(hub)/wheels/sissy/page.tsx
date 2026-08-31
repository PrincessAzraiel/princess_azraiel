"use client";

import React, { useState } from 'react';
import '../wheels.css'; // Importing the dedicated CSS file!

// Options definition with colors. Ensure this matches the visual order in the CSS.
const WHEEL_OPTIONS = [
  { id: 1, label: "10 MIN LOCK", color: "#e6007e" },
  { id: 2, label: "WRITE LINES", color: "#800040" },
  { id: 3, label: "ACCESS GRANTED", color: "#ff4da6" },
  { id: 4, label: "PAY TRIBUTE", color: "#b30059" },
  { id: 5, label: "WALLPAPER", color: "#ff1a8c" },
  { id: 6, label: "CONFESS", color: "#99004d" },
];

export default function ComplianceWheelPage() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Generates the perfectly smooth slice colors natively in CSS based on the options.
  const conicGradient = `conic-gradient(${WHEEL_OPTIONS.map((opt, i) => {
    const step = 360 / WHEEL_OPTIONS.length;
    return `${opt.color} ${i * step}deg ${(i + 1) * step}deg`;
  }).join(", ")})`;

  // THE FIXED SPIN FUNCTION
  const spinWheel = () => {
    if (isSpinning) return; // Prevent double spinning

    setIsSpinning(true);
    setResult(null); // Clear previous result

    // Number of extra full rotations for suspense (between 5 and 9)
    const extraSpins = Math.floor(Math.random() * 5) + 5;
    
    // Select a random winning segment index
    const winningSegment = Math.floor(Math.random() * WHEEL_OPTIONS.length);
    
    // Calculate the precise absolute degree to land on the chosen segment 
    // where the top pointer will point at the middle of the slice.
    const segmentAngle = 360 / WHEEL_OPTIONS.length;
    const targetDegree = 360 - (winningSegment * segmentAngle + (segmentAngle / 2));
    
    // FIX: Calculate how much *further* we need to rotate from our CURRENT position
    // to reach that absolute target degree, and keep the spinning forward.
    setRotation((prevRotation) => {
      // Find our current "0-359" position based on previous accumulated spins
      const currentMod = prevRotation % 360;
      
      // Calculate how many degrees forward we need to move to hit targetDegree
      let rotationDiff = targetDegree - currentMod;
      
      // If the difference is negative or 0, we must wrap around 360 to go forward.
      if (rotationDiff <= 0) {
        rotationDiff += 360;
      }
      
      // Accumulate the new total rotation (current position + forward diff + full extra spins)
      const totalRotation = (extraSpins * 360) + rotationDiff;
      return prevRotation + totalRotation;
    });

    // Wait for the CSS 5-second cubic-bezier transition to finish.
    setTimeout(() => {
      // The result modal now guaranteed to match the visual output.
      setResult(WHEEL_OPTIONS[winningSegment].label);
      setIsSpinning(false);
    }, 5000); 
  };

  return (
    <div className="min-h-screen bg-[#020002] flex items-center justify-center p-8 overflow-hidden font-sans select-none relative">
      
      {/* --- 1. THE DEEP BACKGROUND ENVIRONMENT --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1)_0%,#000_80%)] z-0"></div>
      <div className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-10 pointer-events-none"></div>

      {/* --- 2. AZRAIEL (The Overseer in the background) --- */}
      <img
        src="/image_efdda6.png" 
        alt="Princess"
        className="absolute top-[-50px] left-1/2 -translate-x-1/2 object-cover h-[120%] opacity-40 z-10 pointer-events-none mix-blend-lighten"
        style={{ filter: 'drop-shadow(0 0 50px rgba(255,20,147,0.5)) brightness(0.8)' }}
      />

      {/* --- 3. THE WHEEL INTERFACE --- */}
      <div className="relative z-30 flex flex-col items-center">
        
        {/* Header Text */}
        <div className="text-center mb-12">
          <p className="text-pink-500 font-mono text-sm tracking-[0.4em] mb-2 animate-pulse">
            PUNISHMENT PROTOCOL INITIATED
          </p>
          <h1 className="text-white font-black text-5xl uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
            The Wheel of <span className="text-pink-500">Compliance</span>
          </h1>
        </div>

        {/* The Wheel Container (Structural styles in wheel.css) */}
        <div className="wheel-container">
          
          {/* Static Top Pointer */}
          <div className="wheel-pointer"></div>

          {/* The Spinning Wheel Body */}
          <div 
            className="wheel-body"
            style={{ 
              background: conicGradient, // Dynamically generated slice colors
              transform: `rotate(${rotation}deg)`, // Dynamic accrued spin angle
              transition: 'transform 5s cubic-bezier(0.15, 0.85, 0.15, 1)' // Dramatic slowing easing function
            }}
          >
            {/* Overlay container for labels that must rotate with the wheel */}
            <div className="wheel-text-container">
              {WHEEL_OPTIONS.map((opt, i) => {
                // Calculation to perfectly align text centers within the color slices.
                // Conic-gradient starts at top (-90deg), so math must adjust for this offset.
                const sliceAngle = 360 / WHEEL_OPTIONS.length;
                const centerAngle = (i * sliceAngle) + (sliceAngle / 2) - 90;
                
                return (
                  <div 
                    key={opt.id}
                    className="wheel-segment-text"
                    style={{ transform: `rotate(${centerAngle}deg)` }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Hub/Axe */}
          <div className="wheel-hub">
            <span className="text-pink-500 text-3xl font-black">♡</span>
          </div>
        </div>

        {/* Spin Button */}
        <button 
          onClick={spinWheel}
          disabled={isSpinning || result !== null}
          className={`mt-16 px-12 py-4 font-black uppercase tracking-[0.3em] text-xl transition-all duration-300 border-2 ${
            isSpinning || result !== null
              ? 'bg-neutral-900 border-neutral-700 text-neutral-600 cursor-not-allowed' 
              : 'bg-black border-pink-500 text-pink-500 hover:bg-pink-600 hover:text-white hover:shadow-[0_0_30px_#ff1493] cursor-pointer'
          }`}
        >
          {isSpinning ? 'CALCULATING FATE...' : 'SUBMIT TO CHANCE'}
        </button>

      </div>

      {/* --- 4. THE RESULT MODAL (Pops up after spin) --- */}
      {result && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#050002] border-2 border-pink-500 p-12 max-w-xl text-center shadow-[0_0_100px_rgba(255,20,147,0.6)] animate-pulse">
            <p className="text-pink-400 font-mono text-sm tracking-widest mb-4 uppercase">YOUR FATE HAS BEEN DECIDED</p>
            <h2 className="text-white font-black text-6xl uppercase tracking-tighter mb-8 drop-shadow-[0_0_15px_#ff1493]">
              {result}
            </h2>
            <button 
              onClick={() => setResult(null)}
              className="bg-pink-600 text-white font-bold uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-pink-600 transition-colors"
            >
              ACCEPT
            </button>
          </div>
        </div>
      )}

      {/* Heavy Foreground Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.95)_100%)] z-20 pointer-events-none"></div>

    </div>
  );
}