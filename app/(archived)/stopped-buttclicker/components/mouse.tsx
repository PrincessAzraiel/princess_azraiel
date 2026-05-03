'use client'

const MouseClickEffect = (() => {
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let particles: Array<{
    x: number
    y: number
    dx: number
    dy: number
    size: number
    color: string
    life: number
    maxLife: number
  }> = []
  let ripples: Array<{
    x: number
    y: number
    radius: number
    maxRadius: number
    alpha: number
  }> = []
  let raf: number | null = null
  let mouseX = 0
  let mouseY = 0

  function init(canvasEl: HTMLCanvasElement) {
    if (canvas) return
    canvas = canvasEl
    ctx = canvas.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })
    animate()
  }

  function resize() {
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    if (ctx) ctx.scale(dpr, dpr)
  }

  function getConfig(tag?: string) {
    switch (tag) {
      case 'upgrade':
        return {
          count: 20,
          spread: 50,
          colors: ['#DDFFFF', '#FFDDFF', '#FFFFDD'],
          size: { min: 3, max: 5 },
          lifetime: 2000
        }
      case 'generator':
        return {
          count: 8,
          spread: 30,
          colors: ['#FFFFFF', '#FFFFDD', '#FFFFAA'],
          size: { min: 2, max: 4 },
          lifetime: 2000
        }
      case 'cookie':
        return {
          count: 16,
          spread: 30,
          colors: ['#FFFFFF', '#FFE6F5', '#FFB6E6', '#FF69B4', '#FF1493'],
          size: { min: 6, max: 10 },
          lifetime: 1000
        }
      default:
        return {
          count: 4,
          colors: ['#FFFFFF', '#FFF8E1', '#FFE082', '#FFECB3', '#FFF9C4'],
          spread: 15,
          size: { min: 1, max: 3 },
          lifetime: 600
        }
    }
  }

  function trigger(x: number, y: number, tag?: string) {
    if (!canvas || !ctx) return
    const config = getConfig(tag)

    if (tag === 'cookie') {
      for (let i = 0; i < config.count; i++) {
        const angle = Math.random() * Math.PI * 2
        const velocity = 2 + Math.random() * 3
        particles.push({
          x,
          y,
          dx: Math.cos(angle) * velocity * config.spread / 40,
          dy: Math.sin(angle) * velocity * config.spread / 40,
          size: Math.abs(config.size.min + Math.random() * (config.size.max - config.size.min)),
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          life: config.lifetime,
          maxLife: config.lifetime
        })
      }
    } else if (tag === 'upgrade') {
      for (let i = 0; i < config.count; i++) {
        const angle = Math.random() * Math.PI * 2
        const velocity = 2 + Math.random() * 3
        particles.push({
          x,
          y,
          dx: Math.cos(angle) * velocity * config.spread / 40,
          dy: Math.sin(angle) * velocity * config.spread / 40,
          size: Math.abs(config.size.min + Math.random() * (config.size.max - config.size.min)),
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          life: config.lifetime,
          maxLife: config.lifetime
        })
      }
    } else if (tag === 'generator') {
      for (let i = 0; i < config.count; i++) {
        const angle = Math.random() * Math.PI * 2
        const velocity = 2 + Math.random() * 3
        particles.push({
          x,
          y,
          dx: Math.cos(angle) * velocity * config.spread / 40,
          dy: Math.sin(angle) * velocity * config.spread / 40,
          size: Math.abs(config.size.min + Math.random() * (config.size.max - config.size.min)),
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          life: config.lifetime,
          maxLife: config.lifetime
        })
      }
    } else {
      if (x === 0 && y === 0) {
        return;
      }
      // Ripple effect for normal click
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: 80,
        alpha: 0.5
      })
    }

    if (!raf) animate()
  }

  function animate(time = 0) {
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.dx
      p.y += p.dy
      p.dy += 0.1
      p.life -= 16

      const progress = p.life / p.maxLife
      ctx.globalAlpha = progress
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.abs(p.size * progress), 0, Math.PI * 2)
      ctx.fill()

      if (p.life <= 0) particles.splice(i, 1)
    }

    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]
      r.radius += 2
      r.alpha -= 0.02

      if (r.alpha <= 0) {
        ripples.splice(i, 1)
        continue
      }

      ctx.globalAlpha = r.alpha
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.globalAlpha = 1

    if (particles.length > 0 || ripples.length > 0) {
      raf = requestAnimationFrame(animate)
    } else {
      raf = null
    }
  }

  return {
    init,
    trigger
  }
})()

export default MouseClickEffect
