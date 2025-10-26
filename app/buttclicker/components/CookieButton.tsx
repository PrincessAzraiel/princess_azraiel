'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Cookie } from 'lucide-react'

export default function CookieButton({ onClick }) {
  const [particles, setParticles] = useState([])
  const cookieRef = useRef(null)
  const controls = useAnimation()
  const baseRotation = useRef(0)

  const handleClick = e => {
    if (!cookieRef.current) return
    const rect = cookieRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = Array.from({ length: 8 }).map(() => ({
      id: Math.random(),
      x,
      y,
      dx: (Math.random() - 0.5) * 50,
      dy: (Math.random() - 0.5) * 50,
      color: Math.random() > 0.5 ? 'bg-primary' : 'bg-secondary',
      shadow:
        Math.random() > 0.5
          ? 'shadow-[0_0_6px_rgba(0,128,255,0.8)]'
          : 'shadow-[0_0_6px_rgba(255,0,128,0.8)]'
    }))
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.slice(newParticles.length))
    }, 700)

    const extraTilt = (Math.random() - 0.5) * 25
    const extraScale = [1, 1.2, 0.9, 1]

    controls.start({
      rotate: baseRotation.current + extraTilt,
      scale: extraScale,
      transition: { duration: 0.35, ease: 'easeOut' }
    }).then(() => {
      baseRotation.current += extraTilt
    })

    onClick && onClick()
  }

  return (
    <motion.div
      ref={cookieRef}
      onClick={handleClick}
      animate={controls}
      initial={{ rotate: 0, scale: 1 }}
      className="relative cursor-pointer select-none p-4 rounded-full bg-white/10 backdrop-blur-2xl"
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 0 15px 4px rgba(0,128,255,0.5)',
        borderRadius: '50%'
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 2, -2, 0],
          scale: [1, 1.02, 0.98, 1]
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <Cookie className="w-32 h-32 text-primary" />
      </motion.div>

      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              opacity: 1,
              scale: 0.6,
              rotate: 0
            }}
            animate={{
              x: p.dx,
              y: p.dy,
              opacity: 0,
              scale: 0.3,
              rotate: 0
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`absolute w-2 h-2 rounded-full ${p.color} ${p.shadow} pointer-events-none`}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
