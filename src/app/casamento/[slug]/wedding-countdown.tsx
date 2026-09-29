'use client'

import { useEffect, useState } from 'react'

const weddingTimestamp = new Date('2028-01-22T17:00:00-03:00').getTime()

type RemainingTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateRemainingTime(): RemainingTime {
  const difference = Math.max(0, weddingTimestamp - Date.now())

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  }
}

export default function WeddingCountdown() {
  const [remaining, setRemaining] = useState<RemainingTime | null>(null)

  useEffect(() => {
    const updateCountdown = () => setRemaining(calculateRemainingTime())
    updateCountdown()

    const intervalId = window.setInterval(updateCountdown, 1_000)
    return () => window.clearInterval(intervalId)
  }, [])

  if (!remaining) return null

  const values = [
    ['Dias', remaining.days],
    ['Horas', remaining.hours],
    ['Minutos', remaining.minutes],
    ['Segundos', remaining.seconds],
  ] as const

  return (
    <section className="wedding-countdown" aria-label="Contagem regressiva para o casamento">
      <span className="countdown-kicker">Contagem regressiva</span>
      <div className="countdown-grid">
        {values.map(([label, value]) => (
          <div className="countdown-item" key={label}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
