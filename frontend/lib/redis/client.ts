import Redis from 'ioredis'

// Create Redis client with error handling
let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    redisClient = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })
  }
  return redisClient
}

export const redis = getRedisClient()

export async function getCached<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  const cached = await client.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCached(key: string, value: any, ttl: number = 300) {
  const client = getRedisClient()
  await client.setex(key, ttl, JSON.stringify(value))
}

