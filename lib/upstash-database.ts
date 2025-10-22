import { Redis } from '@upstash/redis'

// Upstash Redis Database for cross-device persistence
class UpstashDatabase {
  private redis: Redis | null = null
  private isInitialized = false
  private prefix: string

  constructor(prefix: string = 'solo-life') {
    this.prefix = prefix
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize Redis with environment variables
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || '',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
      })

      // Test connection
      await this.redis.ping()
      this.isInitialized = true
      console.log('[UpstashDatabase] Connected to Upstash Redis')
    } catch (error) {
      console.warn('[UpstashDatabase] Failed to connect to Upstash Redis:', error)
      this.redis = null
      this.isInitialized = true
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async write<T>(key: string, data: T): Promise<void> {
    await this.initialize()
    
    if (!this.redis) {
      console.log(`[UpstashDatabase] Redis not available, skipping write for ${key}`)
      return
    }
    
    try {
      const redisKey = this.getKey(key)
      const jsonData = JSON.stringify(data)
      
      await this.redis.set(redisKey, jsonData)
      console.log(`[UpstashDatabase] Data written to ${key}`)
    } catch (error) {
      console.error(`[UpstashDatabase] Failed to write ${key}:`, error)
      throw error
    }
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    await this.initialize()
    
    if (!this.redis) {
      console.log(`[UpstashDatabase] Redis not available, returning default for ${key}`)
      return defaultValue
    }
    
    try {
      const redisKey = this.getKey(key)
      const data = await this.redis.get(redisKey)
      
      if (data === null) {
        console.log(`[UpstashDatabase] Key ${key} not found, using default value`)
        return defaultValue
      }

      const parsedData = JSON.parse(data as string) as T
      console.log(`[UpstashDatabase] Data read from ${key}`)
      return parsedData
    } catch (error) {
      console.error(`[UpstashDatabase] Failed to read ${key}:`, error)
      console.log(`[UpstashDatabase] Using default value for ${key}`)
      return defaultValue
    }
  }

  async delete(key: string): Promise<void> {
    await this.initialize()
    
    if (!this.redis) {
      console.log(`[UpstashDatabase] Redis not available, skipping delete for ${key}`)
      return
    }
    
    try {
      const redisKey = this.getKey(key)
      await this.redis.del(redisKey)
      console.log(`[UpstashDatabase] Key ${key} deleted`)
    } catch (error) {
      console.error(`[UpstashDatabase] Failed to delete ${key}:`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    await this.initialize()
    
    if (!this.redis) {
      return false
    }
    
    try {
      const redisKey = this.getKey(key)
      const result = await this.redis.exists(redisKey)
      return result === 1
    } catch (error) {
      console.error(`[UpstashDatabase] Failed to check existence of ${key}:`, error)
      return false
    }
  }

  async listKeys(): Promise<string[]> {
    await this.initialize()
    
    if (!this.redis) {
      return []
    }
    
    try {
      const pattern = `${this.prefix}:*`
      const keys = await this.redis.keys(pattern)
      
      // Remove prefix from keys
      return keys.map(key => key.replace(`${this.prefix}:`, ''))
    } catch (error) {
      console.error('[UpstashDatabase] Failed to list keys:', error)
      return []
    }
  }

  async setTTL(key: string, ttl: number): Promise<void> {
    await this.initialize()
    
    if (!this.redis) {
      return
    }
    
    try {
      const redisKey = this.getKey(key)
      await this.redis.expire(redisKey, ttl)
      console.log(`[UpstashDatabase] TTL set for ${key}: ${ttl} seconds`)
    } catch (error) {
      console.error(`[UpstashDatabase] Failed to set TTL for ${key}:`, error)
      throw error
    }
  }

  async getTTL(key: string): Promise<number> {
    await this.initialize()
    
    if (!this.redis) {
      return -1
    }
    
    try {
      const redisKey = this.getKey(key)
      return await this.redis.ttl(redisKey)
    } catch (error) {
      console.error(`[UpstashDatabase] Failed to get TTL for ${key}:`, error)
      return -1
    }
  }
}

export { UpstashDatabase }
