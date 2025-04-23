import React from 'react'
import OfferingForm from './components/OfferningForm'
import GlitchText from './components/GlitchText'
import LocationTracker from './components/LocationTracker'

export default function App() {
  return (
    <>
      <LocationTracker />
      <div className="magic-bg min-h-screen text-pink-300 flex flex-col items-center justify-center p-6 relative">
        
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

        <div className="z-10 text-center space-y-8">
          <GlitchText text="Offer Your Heart to Princess Azraiel" />
          <OfferingForm />
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 opacity-50">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </>
  )
}