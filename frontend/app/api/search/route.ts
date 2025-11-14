import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { hybridSearch } from '@/lib/ai/rag'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    let searchType = searchParams.get('type') || 'hybrid' // 'keyword', 'vector', or 'hybrid'

    if (!query.trim()) {
      return NextResponse.json({ experiments: [] })
    }

    let experiments

    if (searchType === 'vector' || searchType === 'hybrid') {
      try {
        // Try vector/hybrid search
        if (searchType === 'hybrid') {
          experiments = await hybridSearch(query, limit)
        } else {
          const vectorResults = await vectorSearch(query, limit)
          const ids = vectorResults.map((r) => r.id)
          experiments = await prisma.experiment.findMany({
            where: { id: { in: ids } },
            include: {
              launchedBy: {
                include: {
                  team: true,
                },
              },
            },
          })
        }
      } catch (error) {
        console.error('Vector search error, falling back to keyword:', error)
        // Fallback to keyword search if vector search fails
        searchType = 'keyword'
      }
    }

    if (searchType === 'keyword' || !experiments) {
      // Keyword search fallback
      experiments = await prisma.experiment.findMany({
        where: {
          OR: [
            { testName: { contains: query, mode: 'insensitive' } },
            { experimentId: { contains: query, mode: 'insensitive' } },
            { hypothesis: { contains: query, mode: 'insensitive' } },
            { lessonsLearned: { contains: query, mode: 'insensitive' } },
            { vertical: { contains: query, mode: 'insensitive' } },
            { geo: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          launchedBy: {
            include: {
              team: true,
            },
          },
        },
      })
    }

    return NextResponse.json({ experiments })
  } catch (error) {
    console.error('Error searching experiments:', error)
    return NextResponse.json(
      { error: 'Failed to search experiments' },
      { status: 500 }
    )
  }
}

async function vectorSearch(query: string, limit: number = 10) {
  const { generateEmbedding } = await import('@/lib/ai/embeddings')
  const queryEmbedding = await generateEmbedding(query)
  const embeddingArray = `[${queryEmbedding.join(',')}]`

  const results = await prisma.$queryRawUnsafe<Array<{
    id: string
    experiment_id: string
    test_name: string | null
    similarity: number
  }>>(`
    SELECT 
      id,
      experiment_id,
      test_name,
      1 - (embedding <=> $1::vector) as similarity
    FROM experiments
    WHERE embedding IS NOT NULL
      AND 1 - (embedding <=> $1::vector) > 0.5
    ORDER BY embedding <=> $1::vector
    LIMIT $2
  `, embeddingArray, limit)

  return results
}

