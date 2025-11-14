import OpenAI from 'openai'

let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient()
  const response = await client.embeddings.create({
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    input: text,
  })
  
  return response.data[0].embedding
}

