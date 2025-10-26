'use client'
import React, { useCallback, useRef, useEffect, useState } from 'react'
import CookieButton from './components/button'
import MouseClickEffect from './components/mouse'

interface Generator {
  name: string
  baseCost: number
  count: number
  rate: number
}

interface Upgrade {
  name: string
  cost: number                
  effect: number
  type: 'click' | 'generator' 
  bought: boolean
}

export default function HomePage() {
  const cookieCount = useRef(0)
  const effectsCanvas = useRef<HTMLCanvasElement | null>(null)
  const [displayCount, setDisplayCount] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [generators, setGenerators] = useState<Generator[]>([
    { name: 'Cursor', baseCost: 10, count: 0, rate: 0.1 },
    { name: 'Auto Clicker', baseCost: 50, count: 0, rate: 1 },
  ])
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { name: 'Double Click', cost: 100, effect: 2, type: 'click', bought: false },
    { name: 'Cursor Efficiency', cost: 200, effect: 2, type: 'generator', bought: false },
  ])
  const [clickFeedback, setClickFeedback] = useState(false)

  useEffect(() => {
    if (effectsCanvas.current) MouseClickEffect.init(effectsCanvas.current)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      let totalGain = generators.reduce((sum, gen) => sum + gen.count * gen.rate, 0)
      cookieCount.current += totalGain
      setDisplayCount(Math.floor(cookieCount.current))
    }, 100)
    return () => clearInterval(interval)
  }, [generators])

  const handleClick = useCallback((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    cookieCount.current += clickPower
    setDisplayCount(Math.floor(cookieCount.current))
    setClickFeedback(true)
    setTimeout(() => setClickFeedback(false), 150)
  }, [clickPower])

  const buyGenerator = (index: number) => {
    const gen = generators[index]
    const cost = Math.floor(gen.baseCost * Math.pow(1.15, gen.count))
    if (cookieCount.current >= cost) {
      cookieCount.current -= cost
      setGenerators(prev => {
        const newGen = [...prev]
        newGen[index] = { ...gen, count: gen.count + 1 }
        return newGen
      })
      setDisplayCount(Math.floor(cookieCount.current))
    }
  }

  const buyUpgrade = (index: number) => {
    const upg = upgrades[index]
    if (cookieCount.current >= upg.cost && !upg.bought) {
      cookieCount.current -= upg.cost
      if (upg.type === 'click') setClickPower(prev => prev * upg.effect)
      else setGenerators(prev => prev.map(g => ({ ...g, rate: g.rate * upg.effect })))
      setUpgrades(prev => prev.map((u, i) => i === index ? { ...u, bought: true } : u))
      setDisplayCount(Math.floor(cookieCount.current))
    }
  }

  return (
    <div
      className="w-screen h-screen flex relative overflow-hidden select-none"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        const target = e.target as HTMLElement
        const isCookie = target.closest('[data-click-effect="cookie"]')
        if (!isCookie) MouseClickEffect.trigger(e.clientX, e.clientY, 'default')
      }}
      onKeyDown={(e) => {
        if (e.code === 'Space') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <canvas 
        ref={effectsCanvas}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          zIndex: 100
        }}
      />
      <div className="w-1/5 bg-black/50 backdrop-blur-md p-4 flex flex-col gap-4">
        <h2 className="text-white text-lg font-semibold">Upgrades</h2>
        {upgrades.map((upg, idx) => (
          <button
            key={idx}
            onClick={() => buyUpgrade(idx)}
            className={`w-full p-2 rounded-md border border-white/30 text-white text-sm ${
              upg.bought ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            {upg.name} - {upg.cost}
          </button>
        ))}
        <div className={`text-white text-4xl font-bold mb-6 transition-transform ${clickFeedback ? 'scale-110' : ''}`}>
          {displayCount} Energy
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <CookieButton onClick={handleClick} />
      </div>
      <div className="w-1/5 bg-black/50 backdrop-blur-md p-4 flex flex-col gap-4">
        <h2 className="text-white text-lg font-semibold">Generators</h2>
        {generators.map((gen, idx) => {
          const cost = Math.floor(gen.baseCost * Math.pow(1.15, gen.count))
          return (
            <button
              key={idx}
              onClick={() => buyGenerator(idx)}
              className="w-full p-2 rounded-md border border-white/30 text-white text-sm hover:bg-white/10"
            >
              {gen.name} ({gen.count}) - {cost}
            </button>
          )
        })}
      </div>
    </div>
  )
}
