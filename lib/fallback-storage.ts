// Fallback storage for development when Vercel KV is not available
class FallbackStorage {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async write<T>(key: string, data: T): Promise<void> {
    if (typeof window === 'undefined') {
      console.log(`[FallbackStorage] Server side, skipping write for ${key}`)
      return
    }

    try {
      const storageKey = this.getKey(key)
      const jsonData = JSON.stringify(data)
      console.log(`[FallbackStorage] Writing to key: ${storageKey}`)
      console.log(`[FallbackStorage] Data to write:`, typeof data)
      
      localStorage.setItem(storageKey, jsonData)
      console.log(`[FallbackStorage] Data written to ${key}`)
    } catch (error) {
      console.error(`[FallbackStorage] Failed to write ${key}:`, error)
      throw error
    }
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    if (typeof window === 'undefined') {
      console.log(`[FallbackStorage] Server side, returning default for ${key}`)
      return defaultValue
    }

    try {
      const storageKey = this.getKey(key)
      console.log(`[FallbackStorage] Reading key: ${storageKey}`)
      
      const data = localStorage.getItem(storageKey)
      console.log(`[FallbackStorage] Raw data from localStorage:`, data ? 'exists' : 'null')
      
      if (data === null) {
        console.log(`[FallbackStorage] Key ${key} not found, using default value`)
        return defaultValue
      }

      const parsedData = JSON.parse(data) as T
      console.log(`[FallbackStorage] Data read from ${key}:`, typeof parsedData)
      return parsedData
    } catch (error) {
      console.error(`[FallbackStorage] Failed to read ${key}:`, error)
      console.log(`[FallbackStorage] Using default value for ${key}`)
      return defaultValue
    }
  }

  async delete(key: string): Promise<void> {
    if (typeof window === 'undefined') {
      console.log(`[FallbackStorage] Server side, skipping delete for ${key}`)
      return
    }

    try {
      const storageKey = this.getKey(key)
      localStorage.removeItem(storageKey)
      console.log(`[FallbackStorage] Key ${key} deleted`)
    } catch (error) {
      console.error(`[FallbackStorage] Failed to delete ${key}:`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      const storageKey = this.getKey(key)
      return localStorage.getItem(storageKey) !== null
    } catch (error) {
      console.error(`[FallbackStorage] Failed to check existence of ${key}:`, error)
      return false
    }
  }

  async listKeys(): Promise<string[]> {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix + ':')) {
          keys.push(key.replace(this.prefix + ':', ''))
        }
      }
      return keys
    } catch (error) {
      console.error('[FallbackStorage] Failed to list keys:', error)
      return []
    }
  }
}

export { FallbackStorage }
