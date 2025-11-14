import Anthropic from '@anthropic-ai/sdk'

let anthropic: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable')
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropic
}

export async function generateResponse(prompt: string, systemPrompt: string) {
  const client = getAnthropicClient()
  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })
  
  // Handle different content block types
  const firstBlock = message.content[0]
  if (firstBlock.type === 'text') {
    return firstBlock.text
  }
  
  // Fallback: convert to string if not text block
  return JSON.stringify(firstBlock)
}

