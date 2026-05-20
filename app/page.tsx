'use client'
import { useState, useEffect } from 'react'
import Landing from './landing'
import Journal from './journal'
import Blobs from './blobs'
import ModeToggle from './mode-toggle'
import '../styles/page.css'

type View = 'landing' | 'journal'

export default function MeridianPage() {
  const [view, setView] = useState<View>('landing')
  const [isLight, setIsLight] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('meridian-theme')
    const startLight = saved === 'light'
    setIsLight(startLight)
    applyTheme(startLight)
  }, [])

  function applyTheme(light: boolean) {
    const root = document.documentElement
    root.classList.toggle('light-mode', light)
    root.classList.toggle('dark-mode', !light)
  }

  function toggleMode() {
    setIsLight(prev => {
      const next = !prev
      localStorage.setItem('meridian-theme', next ? 'light' : 'dark')
      applyTheme(next)
      return next
    })
  }

  if (!mounted) return null

  return (
    <div className="app-root">
      <Blobs isLight={isLight} />
      <ModeToggle isLight={isLight} onToggle={toggleMode} />

      <div className={`layer landing-layer ${view === 'landing' ? 'layer-on' : 'layer-off-up'}`}>
        <Landing onEnter={() => setView('journal')} />
      </div>

      <div className={`layer journal-layer ${view === 'journal' ? 'layer-on' : 'layer-off-down'}`}>
        <Journal onExit={() => setView('landing')} />
      </div>
    </div>
  )
}
