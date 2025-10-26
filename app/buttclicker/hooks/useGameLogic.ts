import { useState, useEffect, useCallback, useRef } from 'react'

interface Upgrade {
  id: number
  name: string
  cost: number
  bought: boolean
}

interface Generator {
  id: number
  name: string
  baseCost: number
  count: number
  cps: number
}

interface GameState {
  id: string
  userId: string
  cookies: number
  upgrades: Upgrade[]
  generators: Generator[]
  clickCount: number
}

const USER_ID = 'default_user_1'
const LOCAL_STORAGE_KEY = `game_state_${USER_ID}`
const CLICK_SAVE_THRESHOLD = 15

// ---- Defaults kept separate so we can merge saved state safely
const DEFAULT_UPGRADES: Upgrade[] = [
  // Put “core” first, then cosmetics (order them however you want to display)
  { id: 1, name: 'Click Multiplier x2', cost: 100, bought: false },
  { id: 2, name: 'Cursor Upgrade', cost: 500, bought: false },
  { id: 3, name: 'Double Cursor CPS', cost: 1000, bought: false },
  { id: 4, name: 'Click Multiplier x3', cost: 2500, bought: false },
  { id: 5, name: 'Grandma Power-up', cost: 5000, bought: false },
  { id: 6, name: 'Click Multiplier x5', cost: 15000, bought: false },
  { id: 7, name: 'Farm Efficiency', cost: 25000, bought: false },
  { id: 8, name: 'Factory Automation', cost: 50000, bought: false },
  { id: 9, name: 'Mine Mega-Boost', cost: 100000, bought: false },
  { id: 10, name: 'Click Multiplier x10', cost: 250000, bought: false },

  // Cosmetics
  { id: 11, name: 'Spooky Popups', cost: 2000, bought: false },
  { id: 12, name: 'Ghostly Video Overlay', cost: 8000, bought: false },
  { id: 13, name: 'Haunted Audio Loop', cost: 12000, bought: false },
]

const DEFAULT_GENERATORS: Generator[] = [
  { id: 101, name: 'Cursor', baseCost: 15, count: 0, cps: 0.1 },
  { id: 102, name: 'Grandma', baseCost: 100, count: 0, cps: 1 },
  { id: 103, name: 'Farm', baseCost: 1100, count: 0, cps: 8 },
  { id: 104, name: 'Factory', baseCost: 12000, count: 0, cps: 40 },
  { id: 105, name: 'Mine', baseCost: 130000, count: 0, cps: 200 },
  { id: 106, name: 'Shipment', baseCost: 1400000, count: 0, cps: 600 },
]

const INITIAL_STATE: GameState = {
  id: 'game_1',
  userId: USER_ID,
  cookies: 0,
  clickCount: 0,
  upgrades: DEFAULT_UPGRADES,
  generators: DEFAULT_GENERATORS,
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// ---- Merge helpers (by id) ----
function mergeById<T extends { id: number }>(defaults: T[], saved?: T[]) {
  const map = new Map<number, T>()
  for (const d of defaults) map.set(d.id, { ...d })
  for (const s of saved ?? []) map.set(s.id, { ...(map.get(s.id) ?? s), ...s })
  // sort for stable order — change to sort by cost/name if you prefer
  return Array.from(map.values()).sort((a, b) => a.id - b.id)
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)
  const [clickMultiplier, setClickMultiplier] = useState(1)
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0)
  const [clickFeedback, setClickFeedback] = useState(false)
  const isMounted = useRef(true)

  const { cookies, upgrades, generators } = gameState

  const hasSpookyPopups = upgrades.some(u => u.name === 'Spooky Popups' && u.bought)
  const hasGhostlyVideo = upgrades.some(u => u.name === 'Ghostly Video Overlay' && u.bought)
  const hasHauntedAudio = upgrades.some(u => u.name === 'Haunted Audio Loop' && u.bought)

  const loadGame = useCallback(() => {
    let savedState = null
    try {
      savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    } catch (e) {
      console.error('Local storage access denied during load:', e)
    }

    if (!savedState) {
      if (isMounted.current) setGameState(INITIAL_STATE)
      return
    }

    try {
      const parsedState: GameState = JSON.parse(savedState)

      // Merge saved with defaults so new upgrades/generators appear
      const mergedUpgrades = mergeById(DEFAULT_UPGRADES, parsedState.upgrades)
      const mergedGenerators = mergeById(DEFAULT_GENERATORS, parsedState.generators)

      if (isMounted.current) {
        setGameState({
          ...INITIAL_STATE,
          ...parsedState,
          upgrades: mergedUpgrades,
          generators: mergedGenerators,
          cookies: Number(parsedState.cookies),
          clickCount: Number(parsedState.clickCount) || 0,
        })
      }
    } catch (error) {
      console.error('Error loading game state from local storage:', error)
      if (isMounted.current) setGameState(INITIAL_STATE)
    }
  }, [])

  const saveGame = useCallback((state: GameState) => {
    try {
      const payload = { ...state, cookies: state.cookies }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
    } catch (error) {
      console.error('Error saving game to local storage:', error)
    }
  }, [])

  useEffect(() => {
    loadGame()
    return () => { isMounted.current = false }
  }, [loadGame])

  // Recompute CPS
  useEffect(() => {
    const cps = generators.reduce((sum, g) => {
      let generatorCps = g.cps
      const upgrade3 = upgrades.find(u => u.name === 'Double Cursor CPS')
      if (g.name === 'Cursor' && upgrade3?.bought) generatorCps *= 2
      return sum + g.count * generatorCps
    }, 0)
    setCookiesPerSecond(cps)
  }, [generators, upgrades])

  // Recompute click multiplier
  useEffect(() => {
    let multiplier = 1
    const u2 = upgrades.find(u => u.name === 'Click Multiplier x2')
    const u3 = upgrades.find(u => u.name === 'Click Multiplier x3')
    const u5 = upgrades.find(u => u.name === 'Click Multiplier x5')
    const u10 = upgrades.find(u => u.name === 'Click Multiplier x10')
    if (u2?.bought) multiplier *= 2
    if (u3?.bought) multiplier *= 3 / 2
    if (u5?.bought) multiplier *= 5 / 3
    if (u10?.bought) multiplier *= 10 / 5

    const cursor = generators.find(g => g.name === 'Cursor')
    const uCursor = upgrades.find(u => u.name === 'Cursor Upgrade')
    if (uCursor?.bought && cursor) multiplier += cursor.count * 0.1

    setClickMultiplier(multiplier)
  }, [upgrades, generators])

  // Passive tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({ ...prev, cookies: prev.cookies + cookiesPerSecond / 10 }))
    }, 100)
    return () => clearInterval(interval)
  }, [cookiesPerSecond])

  const handleCookieClick = useCallback(() => {
    setGameState(prev => {
      const newClickCount = prev.clickCount + 1
      const newState = {
        ...prev,
        cookies: prev.cookies + clickMultiplier,
        clickCount: newClickCount,
      }
      if (newClickCount % CLICK_SAVE_THRESHOLD === 0) saveGame(newState)
      return newState
    })
    setClickFeedback(true)
    setTimeout(() => setClickFeedback(false), 50)
  }, [clickMultiplier, saveGame])

  const buyUpgrade = useCallback((index: number) => {
    const upgrade = upgrades[index]
    if (upgrade && !upgrade.bought && cookies >= upgrade.cost) {
      const newUpgrades = [...upgrades]
      newUpgrades[index] = { ...newUpgrades[index], bought: true }
      const newState: GameState = {
        ...gameState,
        cookies: gameState.cookies - upgrade.cost,
        upgrades: newUpgrades,
      }
      setGameState(newState)
      saveGame(newState)
      return true
    }
    return false
  }, [cookies, upgrades, gameState, saveGame])

  const buyGenerator = useCallback((index: number) => {
    const generator = generators[index]
    if (!generator) return false
    const cost = Math.floor(generator.baseCost * Math.pow(1.15, generator.count))
    if (cookies >= cost) {
      const newGenerators = [...generators]
      newGenerators[index] = { ...newGenerators[index], count: newGenerators[index].count + 1 }
      const newState: GameState = {
        ...gameState,
        cookies: gameState.cookies - cost,
        generators: newGenerators,
      }
      setGameState(newState)
      saveGame(newState)
      return true
    }
    return false
  }, [cookies, generators, gameState, saveGame])

  const triggerEffect = useCallback((x: number, y: number) => {}, [])

  return {
    displayCount: gameState.cookies,
    upgrades: gameState.upgrades, // sorted & merged
    generators: gameState.generators,
    hasSpookyPopups,
    hasGhostlyVideo,
    hasHauntedAudio,
    clickFeedback,
    buyUpgrade,
    buyGenerator,
    handleCookieClick,
    triggerEffect,
    cookiesPerSecond,
    gameState,
    saveGame,
  }
}
