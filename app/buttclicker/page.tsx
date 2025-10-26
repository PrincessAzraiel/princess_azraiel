'use client'
import React, { useEffect, useRef, useState } from 'react'
import CookieButton from './components/button'
import MouseClickEffect from './components/mouse'
import { useGameLogic } from './hooks/useGameLogic'
import CookieCounter from './components/counter'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FAILURE_PULSE_KEY = 99999

export default function HomePage() {
  const effectsCanvas = useRef<HTMLCanvasElement | null>(null)
  const {
    displayCount,
    upgrades,
    generators,
    clickFeedback,
    buyUpgrade,
    buyGenerator,
    handleCookieClick,
    gameState,
    saveGame
  } = useGameLogic()

  const [menuOpen, setMenuOpen] = useState(false)
  const [buttonPulse, setButtonPulse] = useState<number | null>(null)

  useEffect(() => {
    if (effectsCanvas.current) MouseClickEffect.init(effectsCanvas.current)
  }, [])

  const handleUpgradeBuy = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionSuccessful = buyUpgrade(index)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX ?? rect.left + rect.width / 2
    const y = e.clientY ?? rect.top + rect.height / 2

    if (transactionSuccessful) {
      MouseClickEffect.trigger(x, y, 'upgrade')
      setButtonPulse(index)
    } else {
      setButtonPulse(FAILURE_PULSE_KEY + index)
    }
    setTimeout(() => setButtonPulse(null), 300)
  }

  const handleGeneratorBuy = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionSuccessful = buyGenerator(index)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX ?? rect.left + rect.width / 2
    const y = e.clientY ?? rect.top + rect.height / 2

    if (transactionSuccessful) {
      MouseClickEffect.trigger(x, y, 'generator')
      setButtonPulse(index + 1000)
    } else {
      setButtonPulse(FAILURE_PULSE_KEY + index + 1000)
    }
    setTimeout(() => setButtonPulse(null), 300)
  }

  const handleClickEffect = (tag: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX ?? rect.left + rect.width / 2
    const y = e.clientY ?? rect.top + rect.height / 2
    MouseClickEffect.trigger(x, y, tag)
  }

  const totalCPS = generators.reduce((sum, g) => sum + g.cps * g.count, 0)

  return (
    <div
      className="w-screen h-screen flex relative overflow-hidden select-none bg-gradient-to-b from-black via-gray-900 to-black"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        handleClickEffect(
          e.currentTarget.getAttribute('data-click-effect') || '',
          e as unknown as React.MouseEvent<HTMLButtonElement>
        )
      }}
      onKeyDown={(e) => {
        if (e.code === 'Space') {
          e.preventDefault()
          handleCookieClick()
        }
      }}
    >
      <canvas
        ref={effectsCanvas}
        className="fixed left-0 top-0 w-full h-full pointer-events-none z-50"
      />

      <button
        onClick={() => setMenuOpen((m) => !m)}
        className="absolute top-4 left-4 z-50 lg:hidden text-white bg-white/10 p-2 rounded-md backdrop-blur-sm hover:bg-white/20 transition"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 lg:w-1/5 bg-white/10 backdrop-blur-xl border-r border-white/10 p-5 flex flex-col gap-4 z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <h2 className="text-white text-xl font-semibold mb-2">Upgrades</h2>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {upgrades.map((u, i) => {
            const isFailure = buttonPulse === FAILURE_PULSE_KEY + i
            const isSuccess = buttonPulse === i

            let pulseClass = ''
            let hoverClass = 'hover:border-yellow-400/50 hover:bg-yellow-400/10'

            if (u.bought) {
              hoverClass = 'opacity-40 cursor-not-allowed'
            } else if (isFailure) {
              pulseClass =
                'animate-pulse-fast border-red-500/80 bg-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.4)]'
              hoverClass = ''
            } else if (isSuccess) {
              pulseClass =
                'animate-pulse-fast border-yellow-400/60 shadow-[0_0_20px_rgba(255,215,0,0.5)]'
              hoverClass = ''
            }

            return (
              <button
                key={i}
                data-click-effect="upgrade"
                onClick={(e) => handleUpgradeBuy(i, e)}
                disabled={u.bought}
                className={`relative group w-full p-3 rounded-lg border border-white/20 text-white text-sm overflow-hidden transition 
                ${hoverClass}
                ${pulseClass}`}
              >
                <span className="font-medium">{u.name}</span>
                <span className="text-xs text-gray-300 ml-1">— {u.cost}</span>
                {!u.bought && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-yellow-500 to-orange-400 transition" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-semibold bg-gradient-to-r from-white via-pink-200 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Cookie Energy Factory
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Click the <span className="text-pink-300 font-semibold">Cookie</span> to generate energy!
          </p>
        </div>

        <CookieButton onClick={handleCookieClick} />

        <div className="absolute bottom-10 flex flex-col items-center text-center">
          <CookieCounter value={displayCount} feedback={clickFeedback} />
          <div className="text-xs text-gray-400 mt-1">
            CPS: <span className="text-cyan-300 font-medium">{totalCPS.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/5 bg-white/10 backdrop-blur-xl border-l border-white/10 p-5 flex-col justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold mb-2">Generators</h2>
          <div className="flex flex-col gap-3 overflow-y-auto">
            {generators.map((g, i) => {
              const cost = Math.floor(g.baseCost * Math.pow(1.15, g.count))
              const isFailure = buttonPulse === FAILURE_PULSE_KEY + i + 1000
              const isSuccess = buttonPulse === i + 1000

              let pulseClass = ''
              let hoverClass = 'hover:border-cyan-400/50 hover:bg-cyan-400/10'

              if (isFailure) {
                pulseClass =
                  'animate-pulse-fast border-red-500/80 bg-red-900/40 shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                hoverClass = ''
              } else if (isSuccess) {
                pulseClass =
                  'animate-pulse-fast border-cyan-400/60 shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                hoverClass = ''
              }

              return (
                <button
                  key={i}
                  data-click-effect="generator"
                  onClick={(e) => handleGeneratorBuy(i, e)}
                  className={`relative group w-full p-3 rounded-lg border border-white/20 text-white text-sm transition flex justify-between 
                  ${hoverClass}
                  ${pulseClass}`}
                >
                  <span>
                    {g.name} <span className="text-gray-400">({g.count})</span>
                  </span>
                  <span className="text-xs text-gray-300">{cost}</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400 to-blue-500 transition" />
                </button>
              )
            })}
          </div>
        </div>
        <Button
          onClick={() => saveGame(gameState)}
          className="mt-4 text-sm bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          Save
        </Button>
      </div>
    </div>
  )
}
