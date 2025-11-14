import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query.trim()) {
      return NextResponse.json({ experiments: [] })
    }

    // Basic keyword search - will be enhanced with vector search later
    const experiments = await prisma.experiment.findMany({
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

    return NextResponse.json({ experiments })
  } catch (error) {
    console.error('Error searching experiments:', error)
    return NextResponse.json(
      { error: 'Failed to search experiments' },
      { status: 500 }
    )
  }
}

