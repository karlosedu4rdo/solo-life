// LocalStorage utilities for Solo Life

import type {
  Player,
  Habit,
  Transaction,
  FinancialGoal,
  Investment,
  Achievement,
  Notification,
  CultureItem,
  Vice,
  WorkoutSession,
  WorkoutLog,
} from "./types"

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

function safeStorageOperation<T>(operation: () => T, fallback: T, errorContext: string): T {
  try {
    return operation()
  } catch (error) {
    console.error(`[Solo Life Storage Error - ${errorContext}]:`, error)
    return fallback
  }
}

// Player storage
export function savePlayer(player: Player): void {
  safeStorageOperation(() => localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player)), undefined, "savePlayer")
}

export function loadPlayer(): Player | null {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER)
      return data ? JSON.parse(data) : null
    },
    null,
    "loadPlayer",
  )
}

// Habits storage
export function saveHabits(habits: Habit[]): void {
  safeStorageOperation(() => localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits)), undefined, "saveHabits")
}

export function loadHabits(): Habit[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadHabits",
  )
}

// Transactions storage
export function saveTransactions(transactions: Transaction[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)),
    undefined,
    "saveTransactions",
  )
}

export function loadTransactions(): Transaction[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadTransactions",
  )
}

// Financial goals storage
export function saveFinancialGoals(goals: FinancialGoal[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.FINANCIAL_GOALS, JSON.stringify(goals)),
    undefined,
    "saveFinancialGoals",
  )
}

export function loadFinancialGoals(): FinancialGoal[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL_GOALS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadFinancialGoals",
  )
}

// Achievements storage
export function saveAchievements(achievements: Achievement[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements)),
    undefined,
    "saveAchievements",
  )
}

export function loadAchievements(): Achievement[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadAchievements",
  )
}

// Notifications storage
export function saveNotifications(notifications: Notification[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)),
    undefined,
    "saveNotifications",
  )
}

export function loadNotifications(): Notification[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadNotifications",
  )
}

// Culture items storage
export function saveCultureItems(items: CultureItem[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.CULTURE_ITEMS, JSON.stringify(items)),
    undefined,
    "saveCultureItems",
  )
}

export function loadCultureItems(): CultureItem[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.CULTURE_ITEMS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadCultureItems",
  )
}

// Vices storage
export function saveVices(vices: Vice[]): void {
  safeStorageOperation(() => localStorage.setItem(STORAGE_KEYS.VICES, JSON.stringify(vices)), undefined, "saveVices")
}

export function loadVices(): Vice[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.VICES)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadVices",
  )
}

// Workout storage
export function saveWorkoutSessions(sessions: WorkoutSession[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.WORKOUT_SESSIONS, JSON.stringify(sessions)),
    undefined,
    "saveWorkoutSessions",
  )
}

export function loadWorkoutSessions(): WorkoutSession[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_SESSIONS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadWorkoutSessions",
  )
}

export function saveWorkoutLogs(logs: WorkoutLog[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs)),
    undefined,
    "saveWorkoutLogs",
  )
}

export function loadWorkoutLogs(): WorkoutLog[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadWorkoutLogs",
  )
}

// Investment storage
export function saveInvestments(investments: Investment[]): void {
  safeStorageOperation(
    () => localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments)),
    undefined,
    "saveInvestments",
  )
}

export function loadInvestments(): Investment[] {
  return safeStorageOperation(
    () => {
      const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS)
      return data ? JSON.parse(data) : []
    },
    [],
    "loadInvestments",
  )
}

// Clear all data
export function clearAllData(): void {
  safeStorageOperation(
    () => {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    },
    undefined,
    "clearAllData",
  )
}
