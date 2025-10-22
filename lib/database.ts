// Check if we're on server side
const isServer = typeof window === 'undefined'

// Dynamic imports for server-only modules
let fs: any = null
let path: any = null

if (isServer) {
  try {
    fs = require('fs')
    path = require('path')
  } catch (error) {
    console.warn('[JSONDatabase] Failed to load fs/path modules:', error)
  }
}

// Database interface
interface DatabaseConfig {
  dataDir: string
  backupDir: string
}

// Simple JSON Database Class
export class JSONDatabase {
  private config: DatabaseConfig
  private isInitialized = false

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  // Initialize database directories
  private async initialize(): Promise<void> {
    if (this.isInitialized || !isServer || !fs || !path) return

    try {
      // Create data directory if it doesn't exist
      if (!fs.existsSync(this.config.dataDir)) {
        fs.mkdirSync(this.config.dataDir, { recursive: true })
      }

      // Create backup directory if it doesn't exist
      if (!fs.existsSync(this.config.backupDir)) {
        fs.mkdirSync(this.config.backupDir, { recursive: true })
      }

      this.isInitialized = true
    } catch (error) {
      console.error('[JSONDatabase] Failed to initialize:', error)
      throw error
    }
  }

  // Write data to JSON file
  async write<T>(filename: string, data: T): Promise<void> {
    if (!isServer || !fs || !path) return
    
    await this.initialize()
    
    try {
      const filePath = path.join(this.config.dataDir, `${filename}.json`)
      const jsonData = JSON.stringify(data, null, 2)
      
      // Write atomically using temporary file
      const tempPath = `${filePath}.tmp`
      fs.writeFileSync(tempPath, jsonData, 'utf8')
      fs.renameSync(tempPath, filePath)
      
      console.log(`[JSONDatabase] Data written to ${filename}.json`)
    } catch (error) {
      console.error(`[JSONDatabase] Failed to write ${filename}:`, error)
      throw error
    }
  }

  // Read data from JSON file
  async read<T>(filename: string, defaultValue: T): Promise<T> {
    if (!isServer || !fs || !path) return defaultValue
    
    await this.initialize()
    
    try {
      const filePath = path.join(this.config.dataDir, `${filename}.json`)
      
      if (!fs.existsSync(filePath)) {
        console.log(`[JSONDatabase] File ${filename}.json not found, using default value`)
        return defaultValue
      }

      const fileContent = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileContent) as T
      
      console.log(`[JSONDatabase] Data read from ${filename}.json`)
      return data
    } catch (error) {
      console.error(`[JSONDatabase] Failed to read ${filename}:`, error)
      console.log(`[JSONDatabase] Using default value for ${filename}`)
      return defaultValue
    }
  }

  // Delete JSON file
  async delete(filename: string): Promise<void> {
    if (!isServer || !fs || !path) return
    
    await this.initialize()
    
    try {
      const filePath = path.join(this.config.dataDir, `${filename}.json`)
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`[JSONDatabase] File ${filename}.json deleted`)
      }
    } catch (error) {
      console.error(`[JSONDatabase] Failed to delete ${filename}:`, error)
      throw error
    }
  }

  // Check if file exists
  async exists(filename: string): Promise<boolean> {
    if (!isServer || !fs || !path) return false
    
    await this.initialize()
    
    const filePath = path.join(this.config.dataDir, `${filename}.json`)
    return fs.existsSync(filePath)
  }

  // List all files
  async listFiles(): Promise<string[]> {
    if (!isServer || !fs || !path) return []
    
    await this.initialize()
    
    try {
      const files = fs.readdirSync(this.config.dataDir)
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
    } catch (error) {
      console.error('[JSONDatabase] Failed to list files:', error)
      return []
    }
  }

  // Create backup
  async createBackup(): Promise<string> {
    if (!isServer || !fs || !path) return 'client-backup'
    
    await this.initialize()
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFilename = `backup-${timestamp}.json`
      const backupPath = path.join(this.config.backupDir, backupFilename)
      
      // Read all data files
      const files = await this.listFiles()
      const backupData: Record<string, any> = {}
      
      for (const file of files) {
        const data = await this.read(file, null)
        backupData[file] = data
      }
      
      // Write backup
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8')
      
      console.log(`[JSONDatabase] Backup created: ${backupFilename}`)
      return backupFilename
    } catch (error) {
      console.error('[JSONDatabase] Failed to create backup:', error)
      throw error
    }
  }

  // Restore from backup
  async restoreFromBackup(backupFilename: string): Promise<void> {
    if (!isServer || !fs || !path) return
    
    await this.initialize()
    
    try {
      const backupPath = path.join(this.config.backupDir, backupFilename)
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file ${backupFilename} not found`)
      }
      
      const backupContent = fs.readFileSync(backupPath, 'utf8')
      const backupData = JSON.parse(backupContent)
      
      // Restore each file
      for (const [filename, data] of Object.entries(backupData)) {
        await this.write(filename, data)
      }
      
      console.log(`[JSONDatabase] Restored from backup: ${backupFilename}`)
    } catch (error) {
      console.error(`[JSONDatabase] Failed to restore from backup ${backupFilename}:`, error)
      throw error
    }
  }

  // Get database stats
  async getStats(): Promise<{
    totalFiles: number
    totalSize: number
    files: Array<{ name: string; size: number; modified: Date }>
  }> {
    if (!isServer || !fs || !path) return { totalFiles: 0, totalSize: 0, files: [] }
    
    await this.initialize()
    
    try {
      const files = await this.listFiles()
      const stats = {
        totalFiles: files.length,
        totalSize: 0,
        files: [] as Array<{ name: string; size: number; modified: Date }>
      }
      
      for (const file of files) {
        const filePath = path.join(this.config.dataDir, `${file}.json`)
        const fileStats = fs.statSync(filePath)
        
        stats.totalSize += fileStats.size
        stats.files.push({
          name: file,
          size: fileStats.size,
          modified: fileStats.mtime
        })
      }
      
      return stats
    } catch (error) {
      console.error('[JSONDatabase] Failed to get stats:', error)
      return { totalFiles: 0, totalSize: 0, files: [] }
    }
  }
}

// Database instance
const dataDir = process.env.NODE_ENV === 'production' 
  ? '/tmp/solo-life-data' 
  : path.join(process.cwd(), 'data')

const backupDir = process.env.NODE_ENV === 'production'
  ? '/tmp/solo-life-backups'
  : path.join(process.cwd(), 'backups')

export const db = new JSONDatabase({
  dataDir,
  backupDir
})

// Database operations for each entity
export class DatabaseOperations {
  // Player operations
  static async savePlayer(player: any): Promise<void> {
    await db.write('player', player)
  }

  static async loadPlayer(): Promise<any | null> {
    return await db.read('player', null)
  }

  // Habits operations
  static async saveHabits(habits: any[]): Promise<void> {
    await db.write('habits', habits)
  }

  static async loadHabits(): Promise<any[]> {
    return await db.read('habits', [])
  }

  // Finance operations
  static async saveTransactions(transactions: any[]): Promise<void> {
    await db.write('transactions', transactions)
  }

  static async loadTransactions(): Promise<any[]> {
    return await db.read('transactions', [])
  }

  static async saveFinancialGoals(goals: any[]): Promise<void> {
    await db.write('financial-goals', goals)
  }

  static async loadFinancialGoals(): Promise<any[]> {
    return await db.read('financial-goals', [])
  }

  static async saveInvestments(investments: any[]): Promise<void> {
    await db.write('investments', investments)
  }

  static async loadInvestments(): Promise<any[]> {
    return await db.read('investments', [])
  }

  // Culture operations
  static async saveCultureItems(items: any[]): Promise<void> {
    await db.write('culture-items', items)
  }

  static async loadCultureItems(): Promise<any[]> {
    return await db.read('culture-items', [])
  }

  // Vices operations
  static async saveVices(vices: any[]): Promise<void> {
    await db.write('vices', vices)
  }

  static async loadVices(): Promise<any[]> {
    return await db.read('vices', [])
  }

  // Workout operations
  static async saveWorkoutSessions(sessions: any[]): Promise<void> {
    await db.write('workout-sessions', sessions)
  }

  static async loadWorkoutSessions(): Promise<any[]> {
    return await db.read('workout-sessions', [])
  }

  static async saveWorkoutLogs(logs: any[]): Promise<void> {
    await db.write('workout-logs', logs)
  }

  static async loadWorkoutLogs(): Promise<any[]> {
    return await db.read('workout-logs', [])
  }

  // Achievements operations
  static async saveAchievements(achievements: any[]): Promise<void> {
    await db.write('achievements', achievements)
  }

  static async loadAchievements(): Promise<any[]> {
    return await db.read('achievements', [])
  }

  // Notifications operations
  static async saveNotifications(notifications: any[]): Promise<void> {
    await db.write('notifications', notifications)
  }

  static async loadNotifications(): Promise<any[]> {
    return await db.read('notifications', [])
  }

  // Backup operations
  static async createBackup(): Promise<string> {
    return await db.createBackup()
  }

  static async restoreFromBackup(backupFilename: string): Promise<void> {
    return await db.restoreFromBackup(backupFilename)
  }

  static async getStats(): Promise<any> {
    return await db.getStats()
  }
}
