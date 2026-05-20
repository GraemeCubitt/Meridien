/*
  * This file implements the main journal interface for the application. It provides a sidebar for listing and
  * selecting journal entries, and a main pane for writing new entries or reading existing ones. The component
  * manages state for the current content being written, the list of entries fetched from the server, and the
  * currently selected entry. It also handles saving new entries to the backend via API calls and fetching
  * existing entries on mount. The UI is styled with CSS-in-JS
*/

'use client'
import { useState, useEffect, useRef } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import '../styles/journal.css'

type Entry = {
  id: string
  content: string
  created_at: string
  main_emotion: string | null
}

interface JournalProps {
  onExit: () => void
}

const EMOTIONS = ['Joy', 'Sadness', 'Anger', 'Fear', 'Trust', 'Disgust', 'Anticipation', 'Surprise'] as const
type Emotion = typeof EMOTIONS[number]

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

      /* 
      Temporarily bypassed Anthropic SDK to avoid client-side exposure.
      Defaulting to 'Anticipation' for the placeholder version.
    */
    const finalEmotion: Emotion = 'Anticipation'
      const res =await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          main_emotion: finalEmotion
        }),
      })

      const savedEntryFromDB = await res.json()

      // 2. Clear out your input textarea box
      setContent('')

      // 3. Immediately point the UI to show this new entry
      setSelected(savedEntryFromDB)

      // 4. Update your background sidebar list
      await fetchEntries()

    } catch (e) {
      console.error('Failed to classify or save entry', e)
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
              <span className="emotion-display">{e.main_emotion}</span>
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
          <div className="header-meta-stack">
            <span className="mono-label date-display">
              {selected ? formatDate(selected.created_at) : formatDate(new Date().toISOString())}
            </span>
            {selected && selected.main_emotion && (
              <span className="emotion-display">{selected.main_emotion}</span>
            )}
          </div>
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
    </div>
  )
}
