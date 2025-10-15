// Core types for Solo Life app

export interface PlayerStats {
  willpower: number // Poder de Vontade - consistency in daily habits
  intelligence: number // Inteligência - reading and learning progress
  vitality: number // Vitalidade - exercise and self-care
  wealth: number // Riqueza - financial balance
}

export interface Player {
  id: string
  name: string
  avatar?: string // Avatar URL or emoji
  bio?: string // Short bio/description
  level: number
  currentXP: number
  xpToNextLevel: number
  stats: PlayerStats
  titles: string[]
  createdAt: string
  lastActive: string
}

export interface DailyMission {
  id: string
  habitId: string
  name: string
  category: HabitCategory
  completed: boolean
  xpReward: number
  statReward?: {
    stat: keyof PlayerStats
    amount: number
  }
}

export type HabitCategory = "health" | "study" | "creativity" | "finance" | "social"
export type HabitFrequency = "daily" | "weekly" | "monthly"

export interface Habit {
  id: string
  name: string
  description?: string
  category: HabitCategory
  frequency: HabitFrequency
  xpReward: number
  statReward?: {
    stat: keyof PlayerStats
    amount: number
  }
  penalty?: {
    type: "xp" | "stat"
    amount: number
    stat?: keyof PlayerStats
  }
  streak: number
  completionHistory: string[] // ISO date strings
  createdAt: string
  active: boolean
}

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  isFixed?: boolean // For recurring transactions
  createdAt: string
}

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  createdAt: string
  completed: boolean
}

export interface Investment {
  id: string
  name: string
  type: "stocks" | "bonds" | "crypto" | "real_estate" | "funds" | "other"
  amount: number
  currentValue: number
  purchaseDate: string
  description?: string
  createdAt: string
}

export interface AnnualProjection {
  month: string
  projectedBalance: number
  fixedIncome: number
  fixedExpenses: number
  netFlow: number
}

export interface SubTask {
  id: string
  name: string
  completed: boolean
  xpReward: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  category: string
  subTasks: SubTask[]
  totalXPReward: number
  titleReward?: string
  progress: number // 0-100
  completed: boolean
  createdAt: string
  completedAt?: string
}

export type CultureType = "book" | "series" | "anime" | "manga"
export type CultureStatus = "planning" | "in-progress" | "completed" | "dropped" | "on-hold"

export interface CultureItem {
  id: string
  type: CultureType
  title: string
  author?: string
  genre?: string
  status: CultureStatus
  rating?: number // 1-5 stars
  progress?: {
    current: number
    total: number
    unit: "pages" | "episodes" | "chapters"
  }
  startDate?: string
  endDate?: string
  notes?: string
  coverUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Vice {
  id: string
  name: string
  description?: string
  severity: "low" | "medium" | "high"
  triggerSituations?: string[]
  alternativeBehavior?: string
  daysClean: number
  lastRelapse?: string
  relapseHistory: string[] // ISO date strings
  createdAt: string
  active: boolean
}

export type WorkoutType = "strength" | "cardio" | "flexibility" | "sports" | "other"

export interface WorkoutExercise {
  id: string
  name: string
  sets?: number
  reps?: number
  duration?: number // in minutes
  notes?: string
}

export interface WorkoutSession {
  id: string
  name: string
  type: WorkoutType
  exercises: WorkoutExercise[]
  duration?: number // in minutes
  notes?: string
  createdAt: string
}

export interface WorkoutLog {
  id: string
  sessionId: string
  sessionName: string
  date: string
  duration: number
  exercises: WorkoutExercise[]
  notes?: string
  createdAt: string
}

export interface Notification {
  id: string
  type: "success" | "warning" | "info" | "penalty"
  title: string
  message: string
  timestamp: string
  read: boolean
}
