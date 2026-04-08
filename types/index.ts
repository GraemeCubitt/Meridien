export type Entry = {
  id: string
  created_at: string
  body: string
  title: string | null
  themes: string[] | null
  mood: number | null
  reflection: string | null
  question: string | null
}