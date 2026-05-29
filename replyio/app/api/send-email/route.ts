import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const { to, subject, message, ticketNumber } = await request.json()

  const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html: `<p>${message}</p><p>---</p><p>Ticket: ${ticketNumber}</p>`
  })

  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ success: true })
}
