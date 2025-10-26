'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import MouseClickEffect from './mouse'

type Props = { onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

interface Sparkle {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  color: string
  life: number
  maxLife: number
  points: number
}

export default function CookieButton({ onClick }: Props) {
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const [lift, setLift] = useState(0)
  const rotationRange = 10
  const rippleRef = useRef<HTMLCanvasElement>(null)
  const sparkleRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const sparklesRef = useRef<Sparkle[]>([])

  const handleClick = useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const randX = (4 * (Math.random() * rotationRange * 2 - rotationRange)).toFixed(2)
    const randY = (4 * (Math.random() * rotationRange * 2 - rotationRange)).toFixed(2)
    setRotationX(Number(randX))
    setRotationY(Number(randY))
    setLift(-10)
    setTimeout(() => {
      setRotationX(0)
      setRotationY(0)
      setLift(0)
    }, 150)
    const rect = (e?.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    if (e?.clientX == 0 && e?.clientY == 0) {
      // Simulated event (e.g., triggered by keyboard), use center of button
      e = undefined
    }
    MouseClickEffect.trigger(e?.clientX ?? cx, e?.clientY ?? cy, 'cookie')
    const nextRipples = [...ripplesRef.current, { x: cx, y: cy, radius: 25, maxRadius: 800, alpha: 1 }]
    ripplesRef.current = nextRipples
    const newSparkles: Sparkle[] = []
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 6 + Math.random() * 4
      const points = 4 + Math.floor(Math.random() * 2)
      newSparkles.push({
        x: cx,
        y: cy,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color: 'rgba(255,255,255,0.8)',
        life: 60 + Math.random() * 20,
        maxLife: 60 + Math.random() * 20,
        points,
      })
    }
    sparklesRef.current = [...sparklesRef.current, ...newSparkles]
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
    onClick?.(e)
  }, [onClick])

  const resizeCanvas = useCallback(() => {
    const dpr = window.devicePixelRatio || 1
    const resize = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize(rippleRef.current)
    resize(sparkleRef.current)
  }, [])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number, color: string) => {
    const step = Math.PI / points
    ctx.beginPath()
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? radius : radius / 2
      const a = i * step
      ctx.lineTo(x + r * Math.sin(a), y - r * Math.cos(a))
    }
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  const animate = useCallback(() => {
    const rippleCanvas = rippleRef.current
    const sparkleCanvas = sparkleRef.current
    if (!rippleCanvas || !sparkleCanvas) {
      rafRef.current = null
      return
    }
    const rippleCtx = rippleCanvas.getContext('2d')
    const sparkleCtx = sparkleCanvas.getContext('2d')
    if (!rippleCtx || !sparkleCtx) {
      rafRef.current = null
      return
    }
    const dpr = window.devicePixelRatio || 1
    rippleCtx.clearRect(0, 0, rippleCanvas.width / dpr, rippleCanvas.height / dpr)
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width / dpr, sparkleCanvas.height / dpr)
    const newRipples: Ripple[] = []
    for (let r of ripplesRef.current) {
      const newRadius = r.radius + 6
      const newAlpha = r.alpha * Math.max(0, 1 - newRadius / r.maxRadius)
      if (newAlpha > 0.01 && newRadius < r.maxRadius) {
        rippleCtx.globalAlpha = newAlpha
        rippleCtx.strokeStyle = '#eeeeff'
        rippleCtx.lineWidth = 4
        rippleCtx.beginPath()
        rippleCtx.arc(r.x, r.y, newRadius, 0, Math.PI * 2)
        rippleCtx.stroke()
        newRipples.push({ ...r, radius: newRadius, alpha: newAlpha })
      }
    }
    ripplesRef.current = newRipples
    const newSparkles: Sparkle[] = []
    for (let s of sparklesRef.current) {
      const progress = 1 - s.life / s.maxLife
      const decay = Math.exp(-progress * 3)
      s.x += s.dx * decay
      s.y += s.dy * decay
      s.life -= 1
      if (s.life > 0) {
        sparkleCtx.globalAlpha = s.life / s.maxLife
        drawStar(sparkleCtx, s.x, s.y, s.size, s.points, s.color)
        newSparkles.push(s)
      }
    }
    sparklesRef.current = newSparkles
    if (newRipples.length > 0 || newSparkles.length > 0) rafRef.current = requestAnimationFrame(animate)
    else rafRef.current = null
  }, [])

  useEffect(() => {
    if ((ripplesRef.current.length > 0 || sparklesRef.current.length > 0) && rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  return (
    <>
      <canvas ref={rippleRef} className="fixed left-0 top-0 w-full h-full pointer-events-none z-10" />
      <canvas ref={sparkleRef} className="fixed left-0 top-0 w-full h-full pointer-events-none z-20" />
      <button
        onClick={handleClick}
        className="relative z-40 w-40 h-40 rounded-full border-4 border-white flex items-center justify-center cursor-pointer transition-transform duration-150 ease-out"
        style={{
          transform: `translateZ(${lift}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          perspective: 800
        }}
      >
        <img
          src="https://i.pinimg.com/1200x/28/c5/f5/28c5f570ff9fb3becea9faa343a00302.jpg"
          className="rounded-full select-none"
          draggable={false}
        />
      </button>
    </>
  )
}
