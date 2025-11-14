import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCached(key: string, value: any, ttl: number = 300) {
  await redis.setex(key, ttl, JSON.stringify(value))
}

