'use client'
import { useState, useEffect } from 'react'
import Landing from './landing'
import Journal from './journal'
import Blobs from './blobs'
import ModeToggle from './mode-toggle'

type View = 'landing' | 'journal'

export default function MeridianPage() {
  const [view, setView] = useState<View>('landing')
  const [isLight, setIsLight] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('meridian-theme')
    if (saved === 'light') setIsLight(true)
  }, [])

  function toggleMode() {
    setIsLight(prev => {
      const next = !prev
      localStorage.setItem('meridian-theme', next ? 'light' : 'dark')
      return next
    })
  }

  if (!mounted) return null

  return (
    <div className={`app-root ${isLight ? 'light-mode' : 'dark-mode'}`}>
      {/* Ambient background */}
      <Blobs isLight={isLight} />

      {/* Mode toggle — always visible */}
      <ModeToggle isLight={isLight} onToggle={toggleMode} />

      {/* Landing — swipes down on enter */}
      <div className={`layer landing-layer ${view === 'landing' ? 'layer-on' : 'layer-off-up'}`}>
        <Landing onEnter={() => setView('journal')} />
      </div>

      {/* Journal — swipes up on enter */}
      <div className={`layer journal-layer ${view === 'journal' ? 'layer-on' : 'layer-off-down'}`}>
        <Journal onExit={() => setView('landing')} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── CSS tokens ── */
        .dark-mode {
          --bg:         #0d0b10;
          --surface:    #131019;
          --surface2:   #1b1625;
          --border:     rgba(138, 100, 220, 0.16);
          --text:       #eae3f8;
          --text2:      #9485b0;
          --text3:      #50445f;
          --accent:     #9b6dff;
          --accent2:    #c084fc;
          --save-bg:    rgba(155, 109, 255, 0.10);
          --save-hover: rgba(155, 109, 255, 0.20);
        }
        .light-mode {
          --bg:         #f4efe6;
          --surface:    #ece6d9;
          --surface2:   #e2dace;
          --border:     rgba(120, 88, 50, 0.18);
          --text:       #2b1f14;
          --text2:      #7a6248;
          --text3:      #b09474;
          --accent:     #7a5c38;
          --accent2:    #a07848;
          --save-bg:    rgba(122, 92, 56, 0.10);
          --save-hover: rgba(122, 92, 56, 0.20);
        }

        html, body { height: 100%; overflow: hidden; }
        body {
          background: var(--bg);
          color: var(--text);
          transition: background 0.5s, color 0.5s;
        }

        .app-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Page layers ── */
        .layer {
          position: fixed;
          inset: 0;
          z-index: 10;
          transition: transform 0.72s cubic-bezier(0.76, 0, 0.24, 1);
          will-change: transform;
        }
        .layer-on       { transform: translateY(0%); pointer-events: all; }
        .layer-off-up   { transform: translateY(-100%); pointer-events: none; }
        .layer-off-down { transform: translateY(100%);  pointer-events: none; }
      `}</style>
    </div>
  )
}
