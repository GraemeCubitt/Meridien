# Meridian 

A fun personal project to learn/develop typescript, Java, CSS, React.
Deployed using Vercel and supabase, this app is a simple proof of concept design to investigate an intruiging idea : what if your journal could talk back?

## File map

```
app/
  page.tsx          ← root page
  landing.tsx       ← landing page component
  journal.tsx       ← journal UI (sidebar + editor)
  blobs.tsx         ← ambient background animation 
  mode-toggle.tsx   ← dark/light toggle button

  content: string
  created_at: string  // ISO 8601
  main_emotion: string | NULL
}
```
## Customisation

All colours live as CSS variables in `page.tsx` under `.dark-mode` and `.light-mode`.
Blob sizes/speeds are in `blobs.tsx` — tweak `animation-duration` and `opacity` to taste.
