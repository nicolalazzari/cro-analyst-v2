import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const vertical = searchParams.get('vertical')
    const geo = searchParams.get('geo')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}
    if (vertical) {
      where.vertical = vertical
    }
    if (geo) {
      where.geo = geo
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [experiments, total] = await Promise.all([
      prisma.experiment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          launchedBy: {
            include: {
              team: true,
            },
          },
        },
      }),
      prisma.experiment.count({ where }),
    ])

    // Get unique values for filters
    const [verticals, geos] = await Promise.all([
      prisma.experiment.findMany({
        select: { vertical: true },
        distinct: ['vertical'],
        where: { vertical: { not: null } },
      }),
      prisma.experiment.findMany({
        select: { geo: true },
        distinct: ['geo'],
        where: { geo: { not: null } },
      }),
    ])

    return NextResponse.json({
      experiments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        verticals: verticals.map((v) => v.vertical).filter(Boolean),
        geos: geos.map((g) => g.geo).filter(Boolean),
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

