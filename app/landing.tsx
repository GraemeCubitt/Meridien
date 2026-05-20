'use client'
import { useEffect, useRef } from 'react'
import '../styles/landing.css'

interface LandingProps {
  onEnter: () => void
}

export default function Landing({ onEnter }: LandingProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      btn.style.setProperty('--mx', `${x}%`)
      btn.style.setProperty('--my', `${y}%`)
    }
    btn.addEventListener('mousemove', handleMouseMove)
    return () => btn.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="landing-root">
      <div className="landing-inner">
        <div className="wordmark-wrap">
          <h1 className="wordmark">Meridian</h1>
          <div className="wordmark-rule" />
        </div>
        <p className="tagline">A reactive journal</p>
        <button ref={btnRef} className="enter-btn" onClick={onEnter}>
          enter
        </button>
      </div>
    </div>
  )
}
