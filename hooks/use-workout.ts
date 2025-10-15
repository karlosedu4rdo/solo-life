"use client"

import { useState, useEffect } from "react"
import type { WorkoutSession, WorkoutLog } from "@/lib/types"
import { saveWorkoutSessions, loadWorkoutSessions, saveWorkoutLogs, loadWorkoutLogs } from "@/lib/storage"

export function useWorkout() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedSessions = loadWorkoutSessions()
    const savedLogs = loadWorkoutLogs()
    setSessions(savedSessions)
    setLogs(savedLogs)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveWorkoutSessions(sessions)
    }
  }, [sessions, isLoading])

  useEffect(() => {
    if (!isLoading) {
      saveWorkoutLogs(logs)
    }
  }, [logs, isLoading])

  const addSession = (session: Omit<WorkoutSession, "id" | "createdAt">) => {
    const newSession: WorkoutSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setSessions((prev) => [...prev, newSession])
    return newSession
  }

  const updateSession = (id: string, updates: Partial<WorkoutSession>) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, ...updates } : session)))
  }

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }

  const logWorkout = (log: Omit<WorkoutLog, "id" | "createdAt">) => {
    const newLog: WorkoutLog = {
      ...log,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setLogs((prev) => [newLog, ...prev])
    return newLog
  }

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id))
  }

  const getRecentLogs = (days = 7) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return logs.filter((log) => new Date(log.date) >= cutoffDate)
  }

  const getStats = () => {
    const totalWorkouts = logs.length
    const totalDuration = logs.reduce((acc, log) => acc + log.duration, 0)
    const recentLogs = getRecentLogs(7)

    return {
      totalWorkouts,
      totalDuration,
      weeklyWorkouts: recentLogs.length,
      weeklyDuration: recentLogs.reduce((acc, log) => acc + log.duration, 0),
    }
  }

  return {
    sessions,
    logs,
    isLoading,
    addSession,
    updateSession,
    deleteSession,
    logWorkout,
    deleteLog,
    getRecentLogs,
    getStats,
  }
}
