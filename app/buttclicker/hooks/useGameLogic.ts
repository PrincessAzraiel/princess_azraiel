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

const INITIAL_STATE: GameState = {
  id: 'game_1',
  userId: USER_ID,
  cookies: 0,
  clickCount: 0,
  upgrades: [
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
  ],
  generators: [
    { id: 101, name: 'Cursor', baseCost: 15, count: 0, cps: 0.1 },
    { id: 102, name: 'Grandma', baseCost: 100, count: 0, cps: 1 },
    { id: 103, name: 'Farm', baseCost: 1100, count: 0, cps: 8 },
    { id: 104, name: 'Factory', baseCost: 12000, count: 0, cps: 40 },
    { id: 105, name: 'Mine', baseCost: 130000, count: 0, cps: 200 },
    { id: 106, name: 'Shipment', baseCost: 1400000, count: 0, cps: 600 },
  ],
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)
  const [clickMultiplier, setClickMultiplier] = useState(1)
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0)
  const [clickFeedback, setClickFeedback] = useState(false)
  const isMounted = useRef(true)

  const { cookies, upgrades, generators, id } = gameState

  const loadGame = useCallback(() => {
    let savedState = null
    try {
        savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    } catch (e) {
        console.error('Local storage access denied during load:', e)
    }

    if (savedState) {
      try {
        const parsedState: GameState = JSON.parse(savedState)
        if (isMounted.current) {
          setGameState({
            ...INITIAL_STATE,
            ...parsedState,
            cookies: Number(parsedState.cookies),
            clickCount: Number(parsedState.clickCount) || 0,
          })
        }
      } catch (error) {
        console.error('Error loading game state from local storage:', error)
        if (isMounted.current) {
          setGameState(INITIAL_STATE)
        }
      }
    } else {
      if (isMounted.current) {
        setGameState(INITIAL_STATE)
      }
    }
  }, [])

  const saveGame = useCallback((state: GameState) => {
    try {
      const payload = {
        ...state,
        cookies: state.cookies,
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))

      console.log(payload);
    } catch (error) {
      console.error('Error saving game to local storage:', error)
    }
  }, [])

  useEffect(() => {
    loadGame()
    return () => {
      isMounted.current = false
    }
  }, [loadGame])

  useEffect(() => {
    let cps = generators.reduce((sum, g) => {
      let generatorCps = g.cps
      const upgrade3 = upgrades.find(u => u.name === 'Double Cursor CPS')
      if (g.name === 'Cursor' && upgrade3?.bought) {
        generatorCps *= 2
      }
      return sum + g.count * generatorCps
    }, 0)
    setCookiesPerSecond(cps)
  }, [generators, upgrades])

  useEffect(() => {
    let multiplier = 1
    const upgrade1 = upgrades.find(u => u.name === 'Click Multiplier x2')
    const upgrade4 = upgrades.find(u => u.name === 'Click Multiplier x3')
    const upgrade6 = upgrades.find(u => u.name === 'Click Multiplier x5')
    const upgrade10 = upgrades.find(u => u.name === 'Click Multiplier x10')

    if (upgrade1?.bought) multiplier *= 2
    if (upgrade4?.bought) multiplier *= 3 / 2
    if (upgrade6?.bought) multiplier *= 5 / 3
    if (upgrade10?.bought) multiplier *= 10 / 5

    const generatorCursor = generators.find(g => g.name === 'Cursor')
    const upgrade2 = upgrades.find(u => u.name === 'Cursor Upgrade')

    if (upgrade2?.bought && generatorCursor) multiplier += generatorCursor.count * 0.1
    
    setClickMultiplier(multiplier)
  }, [upgrades, generators])

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        cookies: prev.cookies + cookiesPerSecond / 10,
      }))
    }, 100)
    return () => clearInterval(interval)
  }, [cookiesPerSecond])


  const handleCookieClick = useCallback(() => {
    setGameState(prev => {
      const newClickCount = (prev.clickCount + 1)
      const newState = {
        ...prev,
        cookies: prev.cookies + clickMultiplier,
        clickCount: newClickCount,
      }

      if (newClickCount % CLICK_SAVE_THRESHOLD === 0) {
        saveGame(newState)
      }

      return newState
    })
    setClickFeedback(true)
    setTimeout(() => setClickFeedback(false), 50)
  }, [clickMultiplier, saveGame])

  const buyUpgrade = useCallback((index: number) => {
    const upgrade = upgrades[index]
    
    // Check if purchase is possible
    if (upgrade && !upgrade.bought && cookies >= upgrade.cost) {
      
      // Calculate the new state outside of the setter's return
      const newUpgrades = [...upgrades]
      newUpgrades[index] = { ...newUpgrades[index], bought: true }
      
      const newState: GameState = {
        ...gameState,
        cookies: gameState.cookies - upgrade.cost,
        upgrades: newUpgrades,
      }
      
      // Update state and save
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
    
    // Check if purchase is possible
    if (cookies >= cost) {
      
      // Calculate the new state outside of the setter's return
      const newGenerators = [...generators]
      newGenerators[index] = { ...newGenerators[index], count: newGenerators[index].count + 1 }
      
      const newState: GameState = {
        ...gameState,
        cookies: gameState.cookies - cost,
        generators: newGenerators,
      }
      
      // Update state and save
      setGameState(newState)
      saveGame(newState)
      
      return true
    }
    return false
  }, [cookies, generators, gameState, saveGame])

  const triggerEffect = useCallback((x: number, y: number) => {
  }, [])

  return {
    displayCount: cookies,
    upgrades,
    generators,
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