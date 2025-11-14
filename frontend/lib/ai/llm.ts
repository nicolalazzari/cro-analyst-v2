import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateResponse(prompt: string, systemPrompt: string) {
  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })
  
  return message.content[0].text
}

