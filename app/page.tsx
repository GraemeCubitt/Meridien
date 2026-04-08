'use client'
import { useState, useEffect } from 'react'

type Entry = {
  id: string
  content: string
  created_at: string
}

export default function Journal() {
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchEntries() }, [])

  async function fetchEntries() {
    const res = await fetch('/api/entries')
    const data = await res.json()
    setEntries(data)
  }

  async function saveEntry() {
    if (!content.trim()) return
    setSaving(true)
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    setContent('')
    setSaving(false)
    fetchEntries()
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0e0d; color: #e8e0d5; font-family: 'Lora', serif; }
        .layout { display: flex; height: 100vh; }

        .sidebar {
          width: 260px;
          min-width: 260px;
          border-right: 1px solid #2a2825;
          display: flex;
          flex-direction: column;
          background: #0c0b0a;
        }
        .sidebar-header {
          padding: 2rem 1.5rem 1rem;
          border-bottom: 1px solid #2a2825;
        }
        .sidebar-title {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6b6560;
          font-family: 'JetBrains Mono', monospace;
        }
        .entries-list { flex: 1; overflow-y: auto; padding: 0.75rem 0; }
        .entry-item {
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          border-left: 2px solid transparent;
          transition: all 0.15s;
        }
        .entry-item:hover { background: #161514; border-left-color: #4a4540; }
        .entry-item.active { background: #1a1917; border-left-color: #c9a96e; }
        .entry-date {
          font-size: 12px;
          color: #6b6560;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 4px;
        }
        .entry-preview {
          font-size: 13px;
          color: #a09890;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-style: italic;
        }

        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .main-header {
          padding: 2rem 3rem 1.5rem;
          border-bottom: 1px solid #2a2825;
        }
        .main-date {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6b6560;
          font-family: 'JetBrains Mono', monospace;
        }
        .main-content { flex: 1; padding: 2.5rem 3rem; overflow-y: auto; }

        textarea {
          width: 100%;
          height: 100%;
          min-height: 400px;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: 'Lora', serif;
          font-size: 18px;
          line-height: 1.85;
          color: #e8e0d5;
          caret-color: #c9a96e;
        }
        textarea::placeholder { color: #3a3733; font-style: italic; }

        .read-view {
          font-size: 18px;
          line-height: 1.85;
          color: #d4ccc4;
          white-space: pre-wrap;
        }

        .footer {
          padding: 1.25rem 3rem;
          border-top: 1px solid #2a2825;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .char-count {
          font-size: 12px;
          color: #4a4540;
          font-family: 'JetBrains Mono', monospace;
        }
        .save-btn {
          background: transparent;
          border: 1px solid #3a3530;
          color: #c9a96e;
          padding: 0.5rem 1.5rem;
          font-family: 'Lora', serif;
          font-size: 14px;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.15s;
        }
        .save-btn:hover { background: #1e1c1a; border-color: #c9a96e; }
        .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .back-btn {
          background: transparent;
          border: none;
          color: #6b6560;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          cursor: pointer;
          letter-spacing: 0.1em;
          padding: 0;
        }
        .back-btn:hover { color: #a09890; }
      `}</style>

      <div className="layout">

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <p className="sidebar-title">Past Entries</p>
          </div>
          <div className="entries-list">
            {entries.map(entry => (
              <div
                key={entry.id}
                className={`entry-item ${selected?.id === entry.id ? 'active' : ''}`}
                onClick={() => setSelected(entry)}
              >
                <p className="entry-date">{formatDate(entry.created_at)}</p>
                <p className="entry-preview">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="main-header">
            <p className="main-date">
              {selected ? formatDate(selected.created_at) : formatDate(new Date().toISOString())}
            </p>
          </div>

          <div className="main-content">
            {selected ? (
              <p className="read-view">{selected.content}</p>
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Begin writing..."
                autoFocus
              />
            )}
          </div>

          <div className="footer">
            {selected ? (
              <button className="back-btn" onClick={() => setSelected(null)}>
                ← new entry
              </button>
            ) : (
              <>
                <span className="char-count">{content.length} chars</span>
                <button className="save-btn" onClick={saveEntry} disabled={saving || !content.trim()}>
                  {saving ? 'saving...' : 'save entry'}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  )
}