"use client"

import { useState, useEffect, useCallback } from "react"
import type { Habit, DailyMission } from "@/lib/types"
import { saveHabits, loadHabits } from "@/lib/storage"

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }
    
    try {
      const savedHabits = loadHabits()
      setHabits(savedHabits)
      setError(null)
    } catch (err) {
      console.error("[useHabits] Error loading habits:", err)
      setError("Failed to load habits")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        saveHabits(habits)
        setError(null)
      } catch (err) {
        console.error("[useHabits] Error saving habits:", err)
        setError("Failed to save habits")
      }
    }
  }, [habits, isLoading])

  const addHabit = useCallback((habit: Omit<Habit, "id" | "createdAt" | "streak" | "completionHistory">) => {
    try {
      const newHabit: Habit = {
        ...habit,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        streak: 0,
        completionHistory: [],
      }
      setHabits((prev) => [...prev, newHabit])
      setError(null)
      return newHabit
    } catch (err) {
      console.error("[useHabits] Error adding habit:", err)
      setError("Failed to add habit")
      return null
    }
  }, [])

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    try {
      setHabits((prev) => prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit)))
      setError(null)
    } catch (err) {
      console.error("[useHabits] Error updating habit:", err)
      setError("Failed to update habit")
    }
  }, [])

  const deleteHabit = useCallback((id: string) => {
    try {
      setHabits((prev) => prev.filter((habit) => habit.id !== id))
      setError(null)
    } catch (err) {
      console.error("[useHabits] Error deleting habit:", err)
      setError("Failed to delete habit")
    }
  }, [])

  const completeHabit = useCallback((id: string, date: string = new Date().toISOString()) => {
    try {
      setHabits((prev) =>
        prev.map((habit) => {
          if (habit.id !== id) return habit

          const dateOnly = date.split("T")[0]
          const alreadyCompleted = habit.completionHistory.some((d) => d.startsWith(dateOnly))

          if (alreadyCompleted) return habit

          const newHistory = [...habit.completionHistory, date].sort()
          const newStreak = calculateStreak(newHistory)

          return {
            ...habit,
            completionHistory: newHistory,
            streak: newStreak,
          }
        }),
      )
      setError(null)
    } catch (err) {
      console.error("[useHabits] Error completing habit:", err)
      setError("Failed to complete habit")
    }
  }, [])

  const uncompleteHabit = useCallback((id: string, date: string) => {
    try {
      setHabits((prev) =>
        prev.map((habit) => {
          if (habit.id !== id) return habit

          const dateOnly = date.split("T")[0]
          const newHistory = habit.completionHistory.filter((d) => !d.startsWith(dateOnly))
          const newStreak = calculateStreak(newHistory)

          return {
            ...habit,
            completionHistory: newHistory,
            streak: newStreak,
          }
        }),
      )
      setError(null)
    } catch (err) {
      console.error("[useHabits] Error uncompleting habit:", err)
      setError("Failed to uncomplete habit")
    }
  }, [])

  const getTodaysMissions = useCallback((): DailyMission[] => {
    try {
      const today = new Date().toISOString().split("T")[0]

      return habits
        .filter((habit) => habit.active && habit.frequency === "daily")
        .map((habit) => ({
          id: habit.id,
          habitId: habit.id,
          name: habit.name,
          category: habit.category,
          completed: habit.completionHistory.some((d) => d.startsWith(today)),
          xpReward: habit.xpReward,
          statReward: habit.statReward,
        }))
    } catch (err) {
      console.error("[useHabits] Error getting today's missions:", err)
      return []
    }
  }, [habits])

  const getFailedMissionsCount = useCallback((): number => {
    try {
      const today = new Date()
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      })

      let failedCount = 0

      habits
        .filter((habit) => habit.active && habit.frequency === "daily")
        .forEach((habit) => {
          last7Days.forEach((date) => {
            const completed = habit.completionHistory.some((d) => d.startsWith(date))
            if (!completed && date !== today.toISOString().split("T")[0]) {
              failedCount++
            }
          })
        })

      return failedCount
    } catch (err) {
      console.error("[useHabits] Error getting failed missions count:", err)
      return 0
    }
  }, [habits])

  return {
    habits,
    isLoading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    getTodaysMissions,
    getFailedMissionsCount,
  }
}

function calculateStreak(completionHistory: string[]): number {
  if (completionHistory.length === 0) return 0

  const sortedDates = completionHistory.map((d) => new Date(d.split("T")[0])).sort((a, b) => b.getTime() - a.getTime())

  let streak = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const mostRecent = sortedDates[0]
  mostRecent.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff > 1) return 0
  if (daysDiff === 1) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (mostRecent.getTime() !== yesterday.getTime()) return 0
  }

  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i]
    const previous = sortedDates[i - 1]
    const diff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24))

    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}
