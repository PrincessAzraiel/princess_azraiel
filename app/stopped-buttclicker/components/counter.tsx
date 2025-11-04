'use client'
import React from 'react'

function formatNumber(num: number) {
  if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, '') + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return Math.floor(num).toString()
}

export default function CookieCounter({ value, feedback }: { value: number, feedback: boolean }) {
  return (
    <div
      className={`text-white text-4xl font-bold mb-6 transition-transform duration-150 ${
        feedback ? 'scale-110' : ''
      }`}
    >
      {formatNumber(value)} Energy
    </div>
  )
}
