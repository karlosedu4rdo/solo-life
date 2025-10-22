import type { Player, Habit, Transaction, FinancialGoal, Achievement, Notification, CultureItem, Vice, WorkoutSession, WorkoutLog, Investment } from "./types"
import { KVOperations } from "./kv-database"

// Client-side storage fallback for development
const STORAGE_KEYS = {
  PLAYER: "solo-life-player",
  HABITS: "solo-life-habits",
  TRANSACTIONS: "solo-life-transactions",
  FINANCIAL_GOALS: "solo-life-financial-goals",
  INVESTMENTS: "solo-life-investments",
  ACHIEVEMENTS: "solo-life-achievements",
  NOTIFICATIONS: "solo-life-notifications",
  CULTURE_ITEMS: "solo-life-culture-items",
  VICES: "solo-life-vices",
  WORKOUT_SESSIONS: "solo-life-workout-sessions",
  WORKOUT_LOGS: "solo-life-workout-logs",
}

// Check if we're on server side
const isServer = typeof window === 'undefined'

// Safe storage operations with error handling
function safeStorageOperation<T>(
  operation: () => T,
  fallback: T,
  operationName: string,
): T {
  try {
    return operation()
  } catch (error) {
    console.error(`[Storage] Error in ${operationName}:`, error)
    return fallback
  }
}

// Player storage
export async function savePlayer(player: Player): Promise<void> {
  if (isServer) {
    await KVOperations.savePlayer(player)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player)),
      undefined,
      "savePlayer",
    )
  }
}

export async function loadPlayer(): Promise<Player | null> {
  if (isServer) {
    return await KVOperations.loadPlayer()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.PLAYER)
        return data ? JSON.parse(data) : null
      },
      null,
      "loadPlayer",
    )
  }
}

// Habits storage
export async function saveHabits(habits: Habit[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveHabits(habits)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits)),
      undefined,
      "saveHabits",
    )
  }
}

export async function loadHabits(): Promise<Habit[]> {
  if (isServer) {
    return await KVOperations.loadHabits()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.HABITS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadHabits",
    )
  }
}

// Transaction storage
export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveTransactions(transactions)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)),
      undefined,
      "saveTransactions",
    )
  }
}

export async function loadTransactions(): Promise<Transaction[]> {
  if (isServer) {
    return await KVOperations.loadTransactions()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadTransactions",
    )
  }
}

// Financial goals storage
export async function saveFinancialGoals(goals: FinancialGoal[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveFinancialGoals(goals)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.FINANCIAL_GOALS, JSON.stringify(goals)),
      undefined,
      "saveFinancialGoals",
    )
  }
}

export async function loadFinancialGoals(): Promise<FinancialGoal[]> {
  if (isServer) {
    return await KVOperations.loadFinancialGoals()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL_GOALS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadFinancialGoals",
    )
  }
}

// Investment storage
export async function saveInvestments(investments: Investment[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveInvestments(investments)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments)),
      undefined,
      "saveInvestments",
    )
  }
}

export async function loadInvestments(): Promise<Investment[]> {
  if (isServer) {
    return await KVOperations.loadInvestments()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadInvestments",
    )
  }
}

// Achievements storage
export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveAchievements(achievements)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements)),
      undefined,
      "saveAchievements",
    )
  }
}

export async function loadAchievements(): Promise<Achievement[]> {
  if (isServer) {
    return await KVOperations.loadAchievements()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadAchievements",
    )
  }
}

// Notifications storage
export async function saveNotifications(notifications: Notification[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveNotifications(notifications)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),
      undefined,
      "saveNotifications",
    )
  }
}

export async function loadNotifications(): Promise<Notification[]> {
  if (isServer) {
    return await KVOperations.loadNotifications()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadNotifications",
    )
  }
}

// Culture items storage
export async function saveCultureItems(items: CultureItem[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveCultureItems(items)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.CULTURE_ITEMS, JSON.stringify(items)),
      undefined,
      "saveCultureItems",
    )
  }
}

export async function loadCultureItems(): Promise<CultureItem[]> {
  if (isServer) {
    return await KVOperations.loadCultureItems()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.CULTURE_ITEMS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadCultureItems",
    )
  }
}

// Vices storage
export async function saveVices(vices: Vice[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveVices(vices)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.VICES, JSON.stringify(vices)),
      undefined,
      "saveVices",
    )
  }
}

export async function loadVices(): Promise<Vice[]> {
  if (isServer) {
    return await KVOperations.loadVices()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.VICES)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadVices",
    )
  }
}

// Workout sessions storage
export async function saveWorkoutSessions(sessions: WorkoutSession[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveWorkoutSessions(sessions)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.WORKOUT_SESSIONS, JSON.stringify(sessions)),
      undefined,
      "saveWorkoutSessions",
    )
  }
}

export async function loadWorkoutSessions(): Promise<WorkoutSession[]> {
  if (isServer) {
    return await KVOperations.loadWorkoutSessions()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_SESSIONS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadWorkoutSessions",
    )
  }
}

// Workout logs storage
export async function saveWorkoutLogs(logs: WorkoutLog[]): Promise<void> {
  if (isServer) {
    await KVOperations.saveWorkoutLogs(logs)
  } else {
    safeStorageOperation(
      () => localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs)),
      undefined,
      "saveWorkoutLogs",
    )
  }
}

export async function loadWorkoutLogs(): Promise<WorkoutLog[]> {
  if (isServer) {
    return await KVOperations.loadWorkoutLogs()
  } else {
    return safeStorageOperation(
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS)
        return data ? JSON.parse(data) : []
      },
      [],
      "loadWorkoutLogs",
    )
  }
}

// Backup operations
export async function createBackup(): Promise<string> {
  if (isServer) {
    return await KVOperations.createBackup()
  } else {
    // Client-side backup (export all data as JSON)
    const backupData = {
      player: await loadPlayer(),
      habits: await loadHabits(),
      transactions: await loadTransactions(),
      financialGoals: await loadFinancialGoals(),
      investments: await loadInvestments(),
      achievements: await loadAchievements(),
      notifications: await loadNotifications(),
      cultureItems: await loadCultureItems(),
      vices: await loadVices(),
      workoutSessions: await loadWorkoutSessions(),
      workoutLogs: await loadWorkoutLogs(),
    }
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solo-life-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    return 'backup-downloaded'
  }
}

export async function restoreFromBackup(backupData: any): Promise<void> {
  if (isServer) {
    // Server-side restore would need backup filename
    throw new Error('Server-side restore requires backup filename')
  } else {
    // Client-side restore
    if (backupData.player) await savePlayer(backupData.player)
    if (backupData.habits) await saveHabits(backupData.habits)
    if (backupData.transactions) await saveTransactions(backupData.transactions)
    if (backupData.financialGoals) await saveFinancialGoals(backupData.financialGoals)
    if (backupData.investments) await saveInvestments(backupData.investments)
    if (backupData.achievements) await saveAchievements(backupData.achievements)
    if (backupData.notifications) await saveNotifications(backupData.notifications)
    if (backupData.cultureItems) await saveCultureItems(backupData.cultureItems)
    if (backupData.vices) await saveVices(backupData.vices)
    if (backupData.workoutSessions) await saveWorkoutSessions(backupData.workoutSessions)
    if (backupData.workoutLogs) await saveWorkoutLogs(backupData.workoutLogs)
  }
}