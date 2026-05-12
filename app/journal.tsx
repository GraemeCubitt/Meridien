/*
  * This file implements the main journal interface for the application. It provides a sidebar for listing and
  * selecting journal entries, and a main pane for writing new entries or reading existing ones. The component
  * manages state for the current content being written, the list of entries fetched from the server, and the
  * currently selected entry. It also handles saving new entries to the backend via API calls and fetching
  * existing entries on mount. The UI is styled with CSS-in-JS
*/ 

'use client'
import { useState, useEffect, useRef } from 'react'

type Entry = {
  id: string
  content: string
  created_at: string
  main_emotion: string | null
}

interface JournalProps {
  onExit: () => void
}

export default function Journal({ onExit }: JournalProps) {
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { fetchEntries() }, [])
  useEffect(() => {
    if (!selected) textareaRef.current?.focus()
  }, [selected])

  async function fetchEntries() {
    try {
      const res = await fetch('/api/entries')
      const data = await res.json()
      setEntries(data)
    } catch (e) {
      console.error('Failed to fetch entries', e)
    }
  }

  async function saveEntry() {
    if (!content.trim()) return
    setSaving(true)
    try {
      await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      setContent('')
      await fetchEntries()
    } catch (e) {
      console.error('Failed to save entry', e)
    } finally {
      setSaving(false)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  function formatDateShort(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    })
  }

  return (
    <div className="journal-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-head">
          <span className="mono-label">Entries</span>
          <button className="new-btn" onClick={() => setSelected(null)}>+ new</button>
        </div>

        <div className="entries-scroll">
          {entries.length === 0 && (
            <p className="empty-hint">No entries yet.</p>
          )}
          {entries.map(e => (
            <div
              key={e.id}
              className={`entry-row ${selected?.id === e.id ? 'active' : ''}`}
              onClick={() => setSelected(e)}
            >
              <span className="entry-date-label">{formatDateShort(e.created_at)}</span>
              <span className="entry-excerpt">{e.content}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-foot">
          <button className="back-home" onClick={onExit}>← meridian</button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-pane">
        <div className="main-head">
          <span className="mono-label date-display">
            {selected ? formatDate(selected.created_at) : formatDate(new Date().toISOString())}
          </span>
          {selected && (
            <button className="inline-btn" onClick={() => setSelected(null)}>
              ← new entry
            </button>
          )}
        </div>

        <div className="main-body">
          {selected ? (
            <p className="read-view">{selected.content}</p>
          ) : (
            <textarea
              ref={textareaRef}
              className="write-area"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Begin writing..."
            />
          )}
        </div>

        {!selected && (
          <div className="main-foot">
            <span className="char-ct mono-label">{content.length} chars</span>
            <button
              className="save-btn"
              onClick={saveEntry}
              disabled={saving || !content.trim()}
            >
              {saving ? 'saving...' : 'save entry'}
            </button>
          </div>
        )}
      </main>

      <style>{`
        .journal-root {
          display: flex;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 230px;
          min-width: 230px;
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border-right: 1px solid var(--border);
          transition: background 0.5s, border-color 0.5s;
        }
        .sidebar-head {
          padding: 1.5rem 1.3rem 0.9rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.5s;
        }
        .new-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--accent2);
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px 4px;
          transition: opacity 0.15s;
        }
        .new-btn:hover { opacity: 0.65; }

        .entries-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 0.4rem 0;
        }
        .entries-scroll::-webkit-scrollbar { width: 4px; }
        .entries-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .empty-hint {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--text3);
          padding: 1.2rem 1.3rem;
          font-style: italic;
        }

        .entry-row {
          padding: 0.6rem 1.3rem;
          cursor: pointer;
          border-left: 2px solid transparent;
          transition: background 0.15s, border-color 0.15s;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .entry-row:hover {
          background: var(--surface2);
          border-left-color: var(--text3);
        }
        .entry-row.active {
          background: var(--surface2);
          border-left-color: var(--accent);
        }
        .entry-date-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--text3);
        }
        .entry-excerpt {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 12px;
          font-style: italic;
          color: var(--text2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-foot {
          padding: 0.8rem 1.3rem;
          border-top: 1px solid var(--border);
          transition: border-color 0.5s;
        }
        .back-home {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .back-home:hover { color: var(--accent); }

        /* ── Main pane ── */
        .main-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .main-head {
          padding: 1.4rem 2.2rem 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.5s;
        }
        .date-display { color: var(--text3); }

        .inline-btn {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--text3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .inline-btn:hover { color: var(--accent); }

        .main-body {
          flex: 1;
          padding: 2rem 2.2rem;
          overflow-y: auto;
        }
        .main-body::-webkit-scrollbar { width: 4px; }
        .main-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .write-area {
          width: 100%;
          height: 100%;
          min-height: 360px;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px;
          line-height: 1.95;
          color: var(--text);
          caret-color: var(--accent);
          transition: color 0.5s;
        }
        .write-area::placeholder {
          color: var(--text3);
          font-style: italic;
        }

        .read-view {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px;
          line-height: 1.95;
          color: var(--text2);
          white-space: pre-wrap;
        }

        .main-foot {
          padding: 1rem 2.2rem;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color 0.5s;
        }
        .char-ct { color: var(--text3); }

        .save-btn {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: lowercase;
          background: var(--save-bg);
          border: 1px solid var(--accent);
          color: var(--accent);
          padding: 0.45rem 1.5rem;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }
        .save-btn:hover:not(:disabled) { background: var(--save-hover); }
        .save-btn:disabled { opacity: 0.32; cursor: not-allowed; }

        .mono-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text3);
        }
      `}</style>
    </div>
  )
}
