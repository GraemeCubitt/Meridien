# Meridian — Drop-in Files

Four components to replace/add to your Next.js app.

## File map

```
app/
  page.tsx          ← root page (replace your existing one, or adjust the path)
  landing.tsx       ← landing page component
  journal.tsx       ← journal UI (sidebar + editor)
  blobs.tsx         ← ambient background blobs
  mode-toggle.tsx   ← dark/light toggle button
```

## Setup

1. **Copy all five files** into your `app/` directory (or wherever your current `page.tsx` lives).

2. **Font** — add to your `layout.tsx` `<head>` (or it's imported via CSS in page.tsx automatically):
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
   ```

3. **Your `/api/entries` routes stay exactly the same** — `journal.tsx` calls:
   - `GET /api/entries` → returns `Entry[]`
   - `POST /api/entries` with `{ content: string }` body

4. **Theme persists** via `localStorage` key `"meridian-theme"`.

## Entry type expected from API

```ts
type Entry = {
  id: string
  content: string
  created_at: string  // ISO 8601
}
```

## Customisation

All colours live as CSS variables in `page.tsx` under `.dark-mode` and `.light-mode`.
Blob sizes/speeds are in `blobs.tsx` — tweak `animation-duration` and `opacity` to taste.
