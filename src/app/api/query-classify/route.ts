import { NextRequest, NextResponse } from 'next/server'
import { createGroq } from '@ai-sdk/groq'
import { generateObject } from 'ai'
import * as z from 'zod'

const groq = createGroq()

export async function POST(request: NextRequest) {
  const data = await request.json()
  const input = data.input

  try {
    const result = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      schema: z.object({
        category: z.enum(['technical', 'non-technical'])
      }),
      prompt: `You are a classification assistant designed to categorize user input based on its relevance to technological subjects. 
      Your job is to analyze the user's input and classify it.

      User's Input: ${input}`
    })

    return NextResponse.json({
      category: result.object.category
    })
  } catch {
    return NextResponse.json({
      error: 'Something went wrong while classifying the prompt'
    })
  }
}
