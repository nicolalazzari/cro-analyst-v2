import { Prisma } from '@prisma/client'

export function handleDatabaseError(error: unknown): { message: string; status: number } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return { message: 'Unique constraint violation', status: 409 }
      case 'P2025':
        return { message: 'Record not found', status: 404 }
      case 'P2003':
        return { message: 'Foreign key constraint violation', status: 400 }
      default:
        return { message: 'Database error occurred', status: 500 }
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return { message: 'Database connection failed', status: 503 }
  }

  if (error instanceof Error) {
    return { message: error.message, status: 500 }
  }

  return { message: 'An unknown error occurred', status: 500 }
}

