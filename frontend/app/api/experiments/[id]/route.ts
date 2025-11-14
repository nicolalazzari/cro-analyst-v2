import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: params.id },
      include: {
        launchedBy: {
          include: {
            team: true,
          },
        },
      },
    })

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(experiment)
  } catch (error) {
    console.error('Error fetching experiment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiment' },
      { status: 500 }
    )
  }
}

