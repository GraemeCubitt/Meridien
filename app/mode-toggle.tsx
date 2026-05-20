'use client'
import '../styles/mode-toggle.css'

interface ModeToggleProps {
  isLight: boolean
  onToggle: () => void
}

export default function ModeToggle({ isLight, onToggle }: ModeToggleProps) {
  return (
    <button
      className={`toggle-wrap ${isLight ? 'light' : 'dark'}`}
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className="icon sun">☀</span>
      <div className="track">
        <div className="thumb" />
      </div>
      <span className="icon moon">☽</span>
    </button>
  )
}
