import { generateEmbedding } from './embeddings'
import { prisma } from '@/lib/db/client'

export async function vectorSearch(query: string, limit: number = 10, threshold: number = 0.7) {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)

  // Convert to PostgreSQL array format
  const embeddingArray = `[${queryEmbedding.join(',')}]`

  // Perform vector similarity search using raw SQL
  // Note: This requires pgvector extension and proper indexing
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
      AND 1 - (embedding <=> $1::vector) > $2
    ORDER BY embedding <=> $1::vector
    LIMIT $3
  `, embeddingArray, threshold, limit)

  return results
}

export async function hybridSearch(
  query: string,
  limit: number = 10,
  vectorWeight: number = 0.7
) {
  // Get vector search results
  const vectorResults = await vectorSearch(query, limit * 2, 0.5)

  // Get keyword search results
  const keywordResults = await prisma.experiment.findMany({
    where: {
      OR: [
        { testName: { contains: query, mode: 'insensitive' } },
        { experimentId: { contains: query, mode: 'insensitive' } },
        { hypothesis: { contains: query, mode: 'insensitive' } },
        { lessonsLearned: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: limit * 2,
    select: {
      id: true,
      experimentId: true,
      testName: true,
    },
  })

  // Combine and deduplicate results
  const resultMap = new Map<string, { id: string; experimentId: string; testName: string | null; score: number }>()

  // Add vector results with weighted scores
  vectorResults.forEach((result) => {
    resultMap.set(result.id, {
      id: result.id,
      experimentId: result.experiment_id,
      testName: result.test_name,
      score: result.similarity * vectorWeight,
    })
  })

  // Add keyword results with weighted scores
  keywordResults.forEach((result) => {
    const existing = resultMap.get(result.id)
    if (existing) {
      existing.score += (1 - vectorWeight) * 0.8 // Boost existing results
    } else {
      resultMap.set(result.id, {
        id: result.id,
        experimentId: result.experimentId,
        testName: result.testName,
        score: (1 - vectorWeight) * 0.8,
      })
    }
  })

  // Sort by combined score and get full experiment data
  const sortedIds = Array.from(resultMap.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)
    .map(([id]) => id)

  if (sortedIds.length === 0) {
    return []
  }

  const experiments = await prisma.experiment.findMany({
    where: { id: { in: sortedIds } },
    include: {
      launchedBy: {
        include: {
          team: true,
        },
      },
    },
  })

  // Maintain sort order
  const sortedExperiments = sortedIds
    .map((id) => experiments.find((exp) => exp.id === id))
    .filter((exp): exp is NonNullable<typeof exp> => exp !== undefined)

  return sortedExperiments
}

