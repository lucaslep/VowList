'use client'

import { useEffect } from 'react'

const MONOGRAM_TOP_OFFSET = 40

export default function InitialInvitationScroll() {
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const monogram = document.querySelector<HTMLElement>('.wedding-monogram')

      if (!monogram) return

      const top = window.scrollY + monogram.getBoundingClientRect().top - MONOGRAM_TOP_OFFSET
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [])

  return null
}
