import Redis from 'ioredis'

// Create Redis client with error handling
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    redis = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
    })

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
  }
  return redis
}

export const redis = getRedisClient()

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCached(key: string, value: any, ttl: number = 300) {
  await redis.setex(key, ttl, JSON.stringify(value))
}

