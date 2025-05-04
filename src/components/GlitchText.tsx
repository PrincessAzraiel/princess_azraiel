import React from 'react'

interface GlitchTextProps {
  text: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text }) => {
  return (
    <h1 
      className="text-4xl md:text-6xl font-bold glitch mb-6"
      data-text={text}
    >
      {text}
    </h1>
  )
}

export default GlitchText