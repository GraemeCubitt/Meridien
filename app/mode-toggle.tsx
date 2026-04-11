'use client'

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

      <style>{`
        .toggle-wrap {
          position: fixed;
          top: 1.3rem;
          right: 1.5rem;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .icon {
          font-size: 13px;
          line-height: 1;
          color: var(--text3);
          transition: color 0.4s, opacity 0.4s;
          user-select: none;
        }
        .toggle-wrap.light .sun { color: var(--accent); }
        .toggle-wrap.dark  .moon { color: var(--accent2); }

        .track {
          width: 40px;
          height: 22px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 11px;
          position: relative;
          transition: background 0.4s, border-color 0.4s;
        }
        .thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s;
        }
        .toggle-wrap.light .thumb {
          transform: translateX(18px);
        }
      `}</style>
    </button>
  )
}
