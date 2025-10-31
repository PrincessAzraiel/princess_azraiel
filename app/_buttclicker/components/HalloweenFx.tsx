'use client'
import React, {
  forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type HalloweenFXHandle = {
  burst: (x: number, y: number) => void
  primeAudio: () => void
}

type Props = {
  videoEnabled: boolean
  audioEnabled: boolean
  imagesCount?: number
  imageExt?: 'png' | 'jpg' | 'webp'
  lifetimeMs?: number
  audioSrc?: string
  audioVolume?: number
}

type Burst = { id: number; src: string; x: number; y: number; w: number; rot: number }

const HalloweenFX = forwardRef<HalloweenFXHandle, Props>(function HalloweenFX(
  {
    videoEnabled,
    audioEnabled,
    imagesCount = 20,
    imageExt = 'webp',
    lifetimeMs = 900,
    audioSrc = '/bam_images/bam_start.mp3',
    audioVolume = 0.5,
  },
  ref
) {
  const [bursts, setBursts] = useState<Burst[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioPrimedRef = useRef(false)

  // Create <audio> element once when enabled; keep it in DOM
  useEffect(() => {
    if (!audioEnabled) {
      if (audioRef.current) {
        try { audioRef.current.pause() } catch {}
      }
      audioRef.current = null
      audioPrimedRef.current = false
      return
    }
    if (!audioRef.current) {
      const el = document.createElement('audio')
      el.loop = true
      el.preload = 'auto'
      el.volume = audioVolume
      el.muted = false
      el.style.display = 'none'
      document.body.appendChild(el)
      audioRef.current = el
    }
  }, [audioEnabled, audioVolume])

  // Update src/volume carefully to avoid AbortError
  useEffect(() => {
    if (!audioEnabled || !audioRef.current) return
    const el = audioRef.current

    // Update volume always
    el.volume = audioVolume

    const resolved = new URL(audioSrc, window.location.origin).href
    if (el.src !== resolved) {
      // Pause before swapping src to avoid interrupting play()
      try { el.pause() } catch {}
      el.src = audioSrc
      audioPrimedRef.current = false // require a new user gesture to start
    }
  }, [audioEnabled, audioSrc, audioVolume])

  // Helpers
  const rand = (min: number, max: number) => Math.random() * (max - min) + min

  const burst = useCallback((_x: number, _y: number) => {
    const w = 128 // fixed width; height auto keeps aspect ratio
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = Math.ceil(w / 4) + 16
    const x = Math.round(rand(margin, Math.max(margin + 1, vw - margin)))
    const y = Math.round(rand(margin, Math.max(margin + 1, vh - margin)))

    const n = Math.floor(Math.random() * imagesCount) + 1
    const id = Math.random()
    const rot = (Math.random() - 0.5) * 20

    const b: Burst = { id, src: `/halloween/${n}.${imageExt}`, x, y, w, rot }
    setBursts(prev => [...prev, b])

    setTimeout(() => {
      setBursts(prev => prev.filter(p => p.id !== id))
    }, lifetimeMs)
  }, [imagesCount, imageExt, lifetimeMs])

  const primeAudio = useCallback(() => {
    if (!audioEnabled || !audioRef.current) return
    const el = audioRef.current

    // If already playing and primed, do nothing
    if (audioPrimedRef.current && !el.paused) return

    el.muted = false
    // Call from a user gesture for autoplay policies
    el.play()
      .then(() => {
        audioPrimedRef.current = true
      })
      .catch((err) => {
        // Will log NotAllowedError (policy) or AbortError if src changes mid-play
        console.error('[HalloweenFX] audio play() failed:', err)
        audioPrimedRef.current = false
      })
  }, [audioEnabled])

  // FIX: deps array has constant size (2)
  useImperativeHandle(ref, () => ({ burst, primeAudio }), [burst, primeAudio])

  return (
    <>
      {videoEnabled && (
        <video
          src="/spirlas2.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* Keep audio element in DOM when enabled for better compatibility */}
      {audioEnabled && (
        <audio
          ref={(el) => {
            if (!el) return
            audioRef.current = el
            el.loop = true
            el.preload = 'auto'
            el.volume = audioVolume
            el.muted = false
            if (el.src !== new URL(audioSrc, window.location.origin).href) {
              try { el.pause() } catch {}
              el.src = audioSrc
              audioPrimedRef.current = false
            }
          }}
          style={{ display: 'none' }}
        />
      )}

      <AnimatePresence>
        {bursts.map(b => (
          <motion.img
            key={b.id}
            src={b.src}
            alt="spooky"
            initial={{
              position: 'fixed',
              left: b.x,
              top: b.y,
              translateX: '-50%',
              translateY: '-50%',
              width: b.w,
              height: 'auto',
              opacity: 0,
              rotate: b.rot,
              zIndex: 60,
              pointerEvents: 'none',
            }}
            animate={{ opacity: 1, rotate: b.rot }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
              // @ts-ignore
              exit: { duration: 0.25, ease: 'easeOut' },
            }}
            style={{ borderRadius: 8, boxShadow: '0 0 12px rgba(0,0,0,0.35)' }}
          />
        ))}
      </AnimatePresence>
    </>
  )
})

export default HalloweenFX
