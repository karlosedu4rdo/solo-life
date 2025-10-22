import { kv } from '@vercel/kv'
import { FallbackStorage } from './fallback-storage'

// Database interface for Vercel KV
interface KVDatabaseConfig {
  prefix: string
  ttl?: number // Time to live in seconds
}

// Vercel KV Database Class
export class KVDatabase {
  private config: KVDatabaseConfig
  private isInitialized = false
  private isKVAvailable = false
  private fallbackStorage: FallbackStorage

  constructor(config: KVDatabaseConfig) {
    this.config = config
    this.fallbackStorage = new FallbackStorage(config.prefix)
  }

  // Initialize database
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Test connection
      await kv.ping()
      this.isKVAvailable = true
      this.isInitialized = true
      console.log('[KVDatabase] Connected to Vercel KV')
    } catch (error) {
      console.warn('[KVDatabase] Vercel KV not available, using fallback storage:', error)
      this.isKVAvailable = false
      this.isInitialized = true
    }
  }

  // Generate key with prefix
  private getKey(key: string): string {
    return `${this.config.prefix}:${key}`
  }

  // Write data to KV store
  async write<T>(key: string, data: T): Promise<void> {
    await this.initialize()
    
    if (!this.isKVAvailable) {
      console.log(`[KVDatabase] KV not available, using fallback for ${key}`)
      return await this.fallbackStorage.write(key, data)
    }
    
    try {
      const kvKey = this.getKey(key)
      const jsonData = JSON.stringify(data)
      
      if (this.config.ttl) {
        await kv.setex(kvKey, this.config.ttl, jsonData)
      } else {
        await kv.set(kvKey, jsonData)
      }
      
      console.log(`[KVDatabase] Data written to ${key}`)
    } catch (error) {
      console.error(`[KVDatabase] Failed to write ${key}, trying fallback:`, error)
      return await this.fallbackStorage.write(key, data)
    }
  }

  // Read data from KV store
  async read<T>(key: string, defaultValue: T): Promise<T> {
    await this.initialize()
    
    if (!this.isKVAvailable) {
      console.log(`[KVDatabase] KV not available, using fallback for ${key}`)
      return await this.fallbackStorage.read(key, defaultValue)
    }
    
    try {
      const kvKey = this.getKey(key)
      const data = await kv.get(kvKey)
      
      if (data === null) {
        console.log(`[KVDatabase] Key ${key} not found, using default value`)
        return defaultValue
      }

      const parsedData = JSON.parse(data as string) as T
      console.log(`[KVDatabase] Data read from ${key}`)
      return parsedData
    } catch (error) {
      console.error(`[KVDatabase] Failed to read ${key}, trying fallback:`, error)
      return await this.fallbackStorage.read(key, defaultValue)
    }
  }

  // Delete data from KV store
  async delete(key: string): Promise<void> {
    await this.initialize()
    
    if (!this.isKVAvailable) {
      console.log(`[KVDatabase] KV not available, using fallback for ${key}`)
      return await this.fallbackStorage.delete(key)
    }
    
    try {
      const kvKey = this.getKey(key)
      await kv.del(kvKey)
      console.log(`[KVDatabase] Key ${key} deleted`)
    } catch (error) {
      console.error(`[KVDatabase] Failed to delete ${key}, trying fallback:`, error)
      return await this.fallbackStorage.delete(key)
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    await this.initialize()
    
    if (!this.isKVAvailable) {
      console.log(`[KVDatabase] KV not available, using fallback for ${key}`)
      return await this.fallbackStorage.exists(key)
    }
    
    try {
      const kvKey = this.getKey(key)
      const result = await kv.exists(kvKey)
      return result === 1
    } catch (error) {
      console.error(`[KVDatabase] Failed to check existence of ${key}, trying fallback:`, error)
      return await this.fallbackStorage.exists(key)
    }
  }

  // List all keys with prefix
  async listKeys(): Promise<string[]> {
    await this.initialize()
    
    if (!this.isKVAvailable) {
      console.log(`[KVDatabase] KV not available, using fallback`)
      return await this.fallbackStorage.listKeys()
    }
    
    try {
      const pattern = `${this.config.prefix}:*`
      const keys = await kv.keys(pattern)
      
      // Remove prefix from keys
      return keys.map(key => key.replace(`${this.config.prefix}:`, ''))
    } catch (error) {
      console.error('[KVDatabase] Failed to list keys, trying fallback:', error)
      return await this.fallbackStorage.listKeys()
    }
  }

  // Create backup of all data
  async createBackup(): Promise<string> {
    await this.initialize()
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupKey = `backup:${timestamp}`
      
      // Get all keys
      const keys = await this.listKeys()
      const backupData: Record<string, any> = {}
      
      // Read all data
      for (const key of keys) {
        const data = await this.read(key, null)
        backupData[key] = data
      }
      
      // Save backup
      await this.write(backupKey, backupData)
      
      console.log(`[KVDatabase] Backup created: ${backupKey}`)
      return backupKey
    } catch (error) {
      console.error('[KVDatabase] Failed to create backup:', error)
      throw error
    }
  }

  // Restore from backup
  async restoreFromBackup(backupKey: string): Promise<void> {
    await this.initialize()
    
    try {
      const backupData = await this.read(backupKey, null)
      
      if (!backupData) {
        throw new Error(`Backup ${backupKey} not found`)
      }
      
      // Restore each key
      for (const [key, data] of Object.entries(backupData)) {
        await this.write(key, data)
      }
      
      console.log(`[KVDatabase] Restored from backup: ${backupKey}`)
    } catch (error) {
      console.error(`[KVDatabase] Failed to restore from backup ${backupKey}:`, error)
      throw error
    }
  }

  // Get database stats
  async getStats(): Promise<{
    totalKeys: number
    keys: Array<{ name: string; ttl?: number }>
  }> {
    await this.initialize()
    
    try {
      const keys = await this.listKeys()
      const stats = {
        totalKeys: keys.length,
        keys: [] as Array<{ name: string; ttl?: number }>
      }
      
      for (const key of keys) {
        const kvKey = this.getKey(key)
        const ttl = await kv.ttl(kvKey)
        
        stats.keys.push({
          name: key,
          ttl: ttl > 0 ? ttl : undefined
        })
      }
      
      return stats
    } catch (error) {
      console.error('[KVDatabase] Failed to get stats:', error)
      return { totalKeys: 0, keys: [] }
    }
  }

  // Set TTL for a key
  async setTTL(key: string, ttl: number): Promise<void> {
    await this.initialize()
    
    try {
      const kvKey = this.getKey(key)
      await kv.expire(kvKey, ttl)
      console.log(`[KVDatabase] TTL set for ${key}: ${ttl} seconds`)
    } catch (error) {
      console.error(`[KVDatabase] Failed to set TTL for ${key}:`, error)
      throw error
    }
  }

  // Get TTL for a key
  async getTTL(key: string): Promise<number> {
    await this.initialize()
    
    try {
      const kvKey = this.getKey(key)
      return await kv.ttl(kvKey)
    } catch (error) {
      console.error(`[KVDatabase] Failed to get TTL for ${key}:`, error)
      return -1
    }
  }

  // Increment a numeric value
  async increment(key: string, amount: number = 1): Promise<number> {
    await this.initialize()
    
    try {
      const kvKey = this.getKey(key)
      return await kv.incrby(kvKey, amount)
    } catch (error) {
      console.error(`[KVDatabase] Failed to increment ${key}:`, error)
      throw error
    }
  }

  // Decrement a numeric value
  async decrement(key: string, amount: number = 1): Promise<number> {
    await this.initialize()
    
    try {
      const kvKey = this.getKey(key)
      return await kv.decrby(kvKey, amount)
    } catch (error) {
      console.error(`[KVDatabase] Failed to decrement ${key}:`, error)
      throw error
    }
  }
}

// Database instance for Solo Life
export const kvDb = new KVDatabase({
  prefix: 'solo-life',
  ttl: 60 * 60 * 24 * 30 // 30 days default TTL
})

// User operations
export class UserOperations {
  // User management
  static async saveUser(user: any): Promise<void> {
    await kvDb.write(`user:${user.id}`, user)
  }

  static async loadUser(userId: string): Promise<any | null> {
    return await kvDb.read(`user:${userId}`, null)
  }

  static async findUserByEmail(email: string): Promise<any | null> {
    console.log('[UserOperations] Finding user by email:', email)
    
    const userKey = `user:email:${email.toLowerCase()}`
    console.log('[UserOperations] Looking for user key:', userKey)
    
    const userId = await kvDb.read(userKey, null)
    console.log('[UserOperations] Found userId:', userId)
    
    if (!userId) {
      console.log('[UserOperations] No userId found for email:', email)
      return null
    }
    
    const user = await kvDb.read(`user:${userId}`, null)
    console.log('[UserOperations] Found user:', user ? { id: user.id, email: user.email, name: user.name } : null)
    
    return user
  }

  static async saveUserEmailIndex(email: string, userId: string): Promise<void> {
    const userKey = `user:email:${email.toLowerCase()}`
    await kvDb.write(userKey, userId)
  }

  static async deleteUser(userId: string): Promise<void> {
    await kvDb.delete(`user:${userId}`)
  }

  // User data operations (scoped by user)
  static async saveUserPlayer(userId: string, player: any): Promise<void> {
    await kvDb.write(`user:${userId}:player`, player)
  }

  static async loadUserPlayer(userId: string): Promise<any | null> {
    return await kvDb.read(`user:${userId}:player`, null)
  }

  static async saveUserHabits(userId: string, habits: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:habits`, habits)
  }

  static async loadUserHabits(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:habits`, [])
  }

  static async saveUserTransactions(userId: string, transactions: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:transactions`, transactions)
  }

  static async loadUserTransactions(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:transactions`, [])
  }

  static async saveUserFinancialGoals(userId: string, goals: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:financial-goals`, goals)
  }

  static async loadUserFinancialGoals(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:financial-goals`, [])
  }

  static async saveUserInvestments(userId: string, investments: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:investments`, investments)
  }

  static async loadUserInvestments(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:investments`, [])
  }

  static async saveUserAchievements(userId: string, achievements: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:achievements`, achievements)
  }

  static async loadUserAchievements(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:achievements`, [])
  }

  static async saveUserNotifications(userId: string, notifications: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:notifications`, notifications)
  }

  static async loadUserNotifications(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:notifications`, [])
  }

  static async saveUserCultureItems(userId: string, items: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:culture-items`, items)
  }

  static async loadUserCultureItems(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:culture-items`, [])
  }

  static async saveUserVices(userId: string, vices: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:vices`, vices)
  }

  static async loadUserVices(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:vices`, [])
  }

  static async saveUserWorkoutSessions(userId: string, sessions: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:workout-sessions`, sessions)
  }

  static async loadUserWorkoutSessions(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:workout-sessions`, [])
  }

  static async saveUserWorkoutLogs(userId: string, logs: any[]): Promise<void> {
    await kvDb.write(`user:${userId}:workout-logs`, logs)
  }

  static async loadUserWorkoutLogs(userId: string): Promise<any[]> {
    return await kvDb.read(`user:${userId}:workout-logs`, [])
  }

  // User backup operations
  static async createUserBackup(userId: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupKey = `user:${userId}:backup:${timestamp}`
    
    // Get all user data
    const userData = {
      player: await UserOperations.loadUserPlayer(userId),
      habits: await UserOperations.loadUserHabits(userId),
      transactions: await UserOperations.loadUserTransactions(userId),
      financialGoals: await UserOperations.loadUserFinancialGoals(userId),
      investments: await UserOperations.loadUserInvestments(userId),
      achievements: await UserOperations.loadUserAchievements(userId),
      notifications: await UserOperations.loadUserNotifications(userId),
      cultureItems: await UserOperations.loadUserCultureItems(userId),
      vices: await UserOperations.loadUserVices(userId),
      workoutSessions: await UserOperations.loadUserWorkoutSessions(userId),
      workoutLogs: await UserOperations.loadUserWorkoutLogs(userId),
    }
    
    // Save backup
    await kvDb.write(backupKey, userData)
    
    console.log(`[UserOperations] Backup created for user ${userId}: ${backupKey}`)
    return backupKey
  }

  static async restoreUserFromBackup(userId: string, backupKey: string): Promise<void> {
    const backupData = await kvDb.read(backupKey, null)
    
    if (!backupData) {
      throw new Error(`Backup ${backupKey} not found`)
    }
    
    // Restore each data type
    if (backupData.player) await UserOperations.saveUserPlayer(userId, backupData.player)
    if (backupData.habits) await UserOperations.saveUserHabits(userId, backupData.habits)
    if (backupData.transactions) await UserOperations.saveUserTransactions(userId, backupData.transactions)
    if (backupData.financialGoals) await UserOperations.saveUserFinancialGoals(userId, backupData.financialGoals)
    if (backupData.investments) await UserOperations.saveUserInvestments(userId, backupData.investments)
    if (backupData.achievements) await UserOperations.saveUserAchievements(userId, backupData.achievements)
    if (backupData.notifications) await UserOperations.saveUserNotifications(userId, backupData.notifications)
    if (backupData.cultureItems) await UserOperations.saveUserCultureItems(userId, backupData.cultureItems)
    if (backupData.vices) await UserOperations.saveUserVices(userId, backupData.vices)
    if (backupData.workoutSessions) await UserOperations.saveUserWorkoutSessions(userId, backupData.workoutSessions)
    if (backupData.workoutLogs) await UserOperations.saveUserWorkoutLogs(userId, backupData.workoutLogs)
    
    console.log(`[UserOperations] Restored user ${userId} from backup: ${backupKey}`)
  }
}

// Database operations for each entity (legacy - for backward compatibility)
export class KVOperations {
  // Player operations
  static async savePlayer(player: any): Promise<void> {
    await kvDb.write('player', player)
  }

  static async loadPlayer(): Promise<any | null> {
    return await kvDb.read('player', null)
  }

  // Habits operations
  static async saveHabits(habits: any[]): Promise<void> {
    await kvDb.write('habits', habits)
  }

  static async loadHabits(): Promise<any[]> {
    return await kvDb.read('habits', [])
  }

  // Finance operations
  static async saveTransactions(transactions: any[]): Promise<void> {
    await kvDb.write('transactions', transactions)
  }

  static async loadTransactions(): Promise<any[]> {
    return await kvDb.read('transactions', [])
  }

  static async saveFinancialGoals(goals: any[]): Promise<void> {
    await kvDb.write('financial-goals', goals)
  }

  static async loadFinancialGoals(): Promise<any[]> {
    return await kvDb.read('financial-goals', [])
  }

  static async saveInvestments(investments: any[]): Promise<void> {
    await kvDb.write('investments', investments)
  }

  static async loadInvestments(): Promise<any[]> {
    return await kvDb.read('investments', [])
  }

  // Culture operations
  static async saveCultureItems(items: any[]): Promise<void> {
    await kvDb.write('culture-items', items)
  }

  static async loadCultureItems(): Promise<any[]> {
    return await kvDb.read('culture-items', [])
  }

  // Vices operations
  static async saveVices(vices: any[]): Promise<void> {
    await kvDb.write('vices', vices)
  }

  static async loadVices(): Promise<any[]> {
    return await kvDb.read('vices', [])
  }

  // Workout operations
  static async saveWorkoutSessions(sessions: any[]): Promise<void> {
    await kvDb.write('workout-sessions', sessions)
  }

  static async loadWorkoutSessions(): Promise<any[]> {
    return await kvDb.read('workout-sessions', [])
  }

  static async saveWorkoutLogs(logs: any[]): Promise<void> {
    await kvDb.write('workout-logs', logs)
  }

  static async loadWorkoutLogs(): Promise<any[]> {
    return await kvDb.read('workout-logs', [])
  }

  // Achievements operations
  static async saveAchievements(achievements: any[]): Promise<void> {
    await kvDb.write('achievements', achievements)
  }

  static async loadAchievements(): Promise<any[]> {
    return await kvDb.read('achievements', [])
  }

  // Notifications operations
  static async saveNotifications(notifications: any[]): Promise<void> {
    await kvDb.write('notifications', notifications)
  }

  static async loadNotifications(): Promise<any[]> {
    return await kvDb.read('notifications', [])
  }

  // Backup operations
  static async createBackup(): Promise<string> {
    return await kvDb.createBackup()
  }

  static async restoreFromBackup(backupKey: string): Promise<void> {
    return await kvDb.restoreFromBackup(backupKey)
  }

  static async getStats(): Promise<any> {
    return await kvDb.getStats()
  }

  // Session operations (for streaks, daily progress, etc.)
  static async saveSession(key: string, data: any, ttl?: number): Promise<void> {
    if (ttl) {
      await kvDb.write(key, data)
      await kvDb.setTTL(key, ttl)
    } else {
      await kvDb.write(key, data)
    }
  }

  static async loadSession(key: string, defaultValue: any = null): Promise<any> {
    return await kvDb.read(key, defaultValue)
  }

  // Counter operations (for XP, levels, etc.)
  static async incrementCounter(key: string, amount: number = 1): Promise<number> {
    return await kvDb.increment(key, amount)
  }

  static async decrementCounter(key: string, amount: number = 1): Promise<number> {
    return await kvDb.decrement(key, amount)
  }
}
