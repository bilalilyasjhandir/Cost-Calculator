import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/aiPrompt'
import { validateAIResponse } from '@/lib/aiResponseValidator'
import { PDFParse } from 'pdf-parse'

export const maxDuration = 60; // Increase max duration for AI requests if needed
export const runtime = 'nodejs'; // Ensure this runs in Node.js, not Edge

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const textInput = formData.get('description') as string | null
    const pdfFile = formData.get('pdf') as File | null

    // Must have one or the other
    if (!textInput && !pdfFile) {
      return NextResponse.json(
        { error: 'no_input', message: 'No description or PDF provided.' },
        { status: 400 }
      )
    }

    // Extract text from PDF if provided
    let projectText = textInput ?? ''
    if (pdfFile) {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const parser = new PDFParse({ data: uint8Array })
      const parsed = await parser.getText()
      projectText = parsed.text?.trim() ?? ''

      if (!projectText) {
        return NextResponse.json(
          {
            error: 'unreadable_pdf',
            message: 'Could not extract text from this PDF. It may be a scanned image. Please type your description instead.'
          },
          { status: 422 }
        )
      }
    }

    // Build prompt and call OpenRouter
    const prompt = buildPrompt(projectText)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? '',
        'X-Title': 'Barakode | Cost Calculator',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: prompt.system
          },
          {
            role: 'user',
            content: prompt.user
          }
        ],
        temperature: 0.1,       // low temperature = more deterministic, less creative
        max_tokens: 4096,
      })
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('OpenRouter error:', err)
      return NextResponse.json(
        { error: 'llm_error', message: 'AI service unavailable. Please try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content ?? ''

    // Extract JSON block from potential surrounding text
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    let cleaned = rawContent;
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    } else {
      // Fallback to stripping markdown code fences
      cleaned = rawContent.replace(/```(?:json)?\s*|\s*```/g, '').trim();
    }

    // Parse JSON
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse LLM response:', rawContent)
      return NextResponse.json(
        { error: 'parse_error', message: 'AI returned an unexpected response. Please try again.' },
        { status: 500 }
      )
    }

    // Handle LLM rejection (irrelevant input)
    if (parsed.error === 'irrelevant') {
      return NextResponse.json(
        { error: 'irrelevant', message: parsed.message },
        { status: 422 }
      )
    }

    if (parsed.error === 'too_vague') {
      return NextResponse.json(
        { error: 'too_vague', message: parsed.message },
        { status: 422 }
      )
    }

    // Validate that returned IDs actually exist in our feature list
    const validated = validateAIResponse(parsed)

    return NextResponse.json({ success: true, result: validated })

  } catch (err: unknown) {
    console.error('analyze-project error:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'server_error', message: 'Something went wrong. Please try again.', details: errorMessage },
      { status: 500 }
    )
  }
}
