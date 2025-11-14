import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const experiments = await prisma.experiment.findMany({
      skip: (page - 1) * limit,
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

    const total = await prisma.experiment.count()

    return NextResponse.json({
      experiments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching experiments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    )
  }
}

