/*
 * This file defines the API routes for server side interactions with the journal entries. It uses Supabase as 
 * the backend database to store and retrieve entries. The POST method allows saving a new entry, while the GET 
 * method fetches all existing entries, ordered by creation date. Error handling is included to ensure proper 
 * responses in case of issues with the database operations.
*/

import { createClient } from '@supabase/supabase-js'

// Create the supabase connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST — save a new entry
export async function POST(req: Request) {
  const { content } = await req.json()

  if (!content || content.trim() === '') {
    return Response.json({ error: 'No content provided' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('entries')
    .insert({ content })
    .select()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data[0])
}

// GET — fetch all entries
export async function GET() {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}