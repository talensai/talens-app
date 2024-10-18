import { NextResponse } from 'next/server'
import OpenAI from "openai"
import evaluateResponsePrompt from '../../prompts/evaluateResponse'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generateResponse(promptData) {
  try {
    const response = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        {
          role: "system",
          content: promptData.systemPrompt
        },
        {
          role: "user",
          content: promptData.userPrompt
        }
      ],
      temperature: promptData.temperature,
      max_tokens: promptData.max_tokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "json_schema",
        json_schema: promptData.responseSchema
      }
    });
    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { question, response } = await request.json()

    if (!question || !response) {
      return NextResponse.json({ error: 'Invalid input data provided' }, { status: 400 })
    }

    const promptData = evaluateResponsePrompt({ question, response })
    const evaluation = await generateResponse(promptData)

    return NextResponse.json({ evaluation })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 })
  }
}
