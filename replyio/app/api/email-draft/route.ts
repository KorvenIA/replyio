import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { replyText, studentName, studentEmail } = await request.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'system',
        content: 'You are a professional customer support email writer. Generate a professional email response.'
      }, {
        role: 'user',
        content: `Generate a professional email for a student named ${studentName}. The support response is: "${replyText}". 
        Return ONLY a JSON object with fields: subject, message (not "body"). No markdown, plain text only.`
      }],
      max_tokens: 500
    })
  })

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  
  try {
    const parsed = JSON.parse(content)
    return NextResponse.json({ 
      subject: parsed.subject || 'Response to your support ticket',
      message: parsed.message || replyText,
      to: studentEmail
    })
  } catch {
    return NextResponse.json({ 
      subject: 'Response to your support ticket',
      message: replyText,
      to: studentEmail
    })
  }
}
