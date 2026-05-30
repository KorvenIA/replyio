import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const { rating, comment, ticketId, ratingType } = await request.json()

  const { error } = await supabase.from('ratings').insert({
    ticket_id: ticketId,
    rating_type: ratingType,
    rating,
    comment
  })

  return error
    ? NextResponse.json({ error }, { status: 500 })
    : NextResponse.json({ success: true })
}
