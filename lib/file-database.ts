// Simple file-based database for Vercel production (server-side only)
class FileDatabase {
  private dataDir: string
  private isInitialized = false

  constructor() {
    // Use /tmp directory in Vercel, fallback to local data directory
    this.dataDir = process.env.NODE_ENV === 'production' 
      ? '/tmp/solo-life-data' 
      : './data'
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    // Only initialize on server side
    if (typeof window !== 'undefined') {
      console.log('[FileDatabase] Client side, skipping initialization')
      this.isInitialized = true
      return
    }

    try {
      // Dynamic import for server-only modules
      const { writeFile, readFile, mkdir } = await import('fs/promises')
      const { join } = await import('path')
      const { existsSync } = await import('fs')
      
      // Create directory if it doesn't exist
      if (!existsSync(this.dataDir)) {
        await mkdir(this.dataDir, { recursive: true })
      }
      this.isInitialized = true
      console.log('[FileDatabase] Initialized with directory:', this.dataDir)
    } catch (error) {
      console.error('[FileDatabase] Failed to initialize:', error)
      this.isInitialized = true // Mark as initialized to prevent retries
    }
  }

  private async getFilePath(key: string): Promise<string> {
    const { join } = await import('path')
    return join(this.dataDir, `${key}.json`)
  }

  async write<T>(key: string, data: T): Promise<void> {
    await this.initialize()
    
    // Skip on client side
    if (typeof window !== 'undefined') {
      console.log(`[FileDatabase] Client side, skipping write for ${key}`)
      return
    }
    
    try {
      const { writeFile } = await import('fs/promises')
      const filePath = await this.getFilePath(key)
      const jsonData = JSON.stringify(data, null, 2)
      
      await writeFile(filePath, jsonData, 'utf8')
      console.log(`[FileDatabase] Data written to ${key}`)
    } catch (error) {
      console.error(`[FileDatabase] Failed to write ${key}:`, error)
      throw error
    }
  }

  async read<T>(key: string, defaultValue: T): Promise<T> {
    await this.initialize()
    
    // Skip on client side
    if (typeof window !== 'undefined') {
      console.log(`[FileDatabase] Client side, returning default for ${key}`)
      return defaultValue
    }
    
    try {
      const { readFile } = await import('fs/promises')
      const { existsSync } = await import('fs')
      const filePath = await this.getFilePath(key)
      
      if (!existsSync(filePath)) {
        console.log(`[FileDatabase] File ${key}.json not found, using default value`)
        return defaultValue
      }

      const fileContent = await readFile(filePath, 'utf8')
      const data = JSON.parse(fileContent) as T
      
      console.log(`[FileDatabase] Data read from ${key}`)
      return data
    } catch (error) {
      console.error(`[FileDatabase] Failed to read ${key}:`, error)
      console.log(`[FileDatabase] Using default value for ${key}`)
      return defaultValue
    }
  }

  async delete(key: string): Promise<void> {
    await this.initialize()
    
    // Skip on client side
    if (typeof window !== 'undefined') {
      console.log(`[FileDatabase] Client side, skipping delete for ${key}`)
      return
    }
    
    try {
      const { writeFile } = await import('fs/promises')
      const { existsSync } = await import('fs')
      const filePath = await this.getFilePath(key)
      
      if (existsSync(filePath)) {
        await writeFile(filePath, '', 'utf8') // Clear file instead of delete
        console.log(`[FileDatabase] File ${key}.json cleared`)
      }
    } catch (error) {
      console.error(`[FileDatabase] Failed to delete ${key}:`, error)
      throw error
    }
  }

  async exists(key: string): Promise<boolean> {
    await this.initialize()
    
    // Skip on client side
    if (typeof window !== 'undefined') {
      return false
    }
    
    try {
      const { existsSync } = await import('fs')
      const filePath = await this.getFilePath(key)
      return existsSync(filePath)
    } catch (error) {
      console.error(`[FileDatabase] Failed to check existence of ${key}:`, error)
      return false
    }
  }

  async listKeys(): Promise<string[]> {
    await this.initialize()
    
    // Skip on client side
    if (typeof window !== 'undefined') {
      return []
    }
    
    try {
      // This is a simplified version - in a real implementation you'd use readdir
      return []
    } catch (error) {
      console.error('[FileDatabase] Failed to list keys:', error)
      return []
    }
  }
}

export { FileDatabase }
