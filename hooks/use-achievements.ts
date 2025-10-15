"use client"

import { useState, useEffect } from "react"
import type { Achievement, SubTask } from "@/lib/types"
import { saveAchievements, loadAchievements } from "@/lib/storage"

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedAchievements = loadAchievements()
    setAchievements(savedAchievements)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveAchievements(achievements)
    }
  }, [achievements, isLoading])

  const addAchievement = (
    achievement: Omit<Achievement, "id" | "createdAt" | "progress" | "completed" | "completedAt">,
  ) => {
    const newAchievement: Achievement = {
      ...achievement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      progress: 0,
      completed: false,
    }
    setAchievements((prev) => [...prev, newAchievement])
    return newAchievement
  }

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements((prev) =>
      prev.map((achievement) => (achievement.id === id ? { ...achievement, ...updates } : achievement)),
    )
  }

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id))
  }

  const toggleSubTask = (achievementId: string, subTaskId: string) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id !== achievementId) return achievement

        const updatedSubTasks = achievement.subTasks.map((task) =>
          task.id === subTaskId ? { ...task, completed: !task.completed } : task,
        )

        const completedCount = updatedSubTasks.filter((t) => t.completed).length
        const progress = (completedCount / updatedSubTasks.length) * 100
        const isCompleted = progress === 100

        return {
          ...achievement,
          subTasks: updatedSubTasks,
          progress,
          completed: isCompleted,
          completedAt: isCompleted && !achievement.completed ? new Date().toISOString() : achievement.completedAt,
        }
      }),
    )
  }

  const addSubTask = (achievementId: string, subTask: Omit<SubTask, "id" | "completed">) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id !== achievementId) return achievement

        const newSubTask: SubTask = {
          ...subTask,
          id: crypto.randomUUID(),
          completed: false,
        }

        const updatedSubTasks = [...achievement.subTasks, newSubTask]
        const completedCount = updatedSubTasks.filter((t) => t.completed).length
        const progress = (completedCount / updatedSubTasks.length) * 100

        return {
          ...achievement,
          subTasks: updatedSubTasks,
          progress,
        }
      }),
    )
  }

  const deleteSubTask = (achievementId: string, subTaskId: string) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id !== achievementId) return achievement

        const updatedSubTasks = achievement.subTasks.filter((t) => t.id !== subTaskId)
        const completedCount = updatedSubTasks.filter((t) => t.completed).length
        const progress = updatedSubTasks.length > 0 ? (completedCount / updatedSubTasks.length) * 100 : 0

        return {
          ...achievement,
          subTasks: updatedSubTasks,
          progress,
          completed: progress === 100,
        }
      }),
    )
  }

  const getCompletedAchievements = () => {
    return achievements.filter((a) => a.completed)
  }

  const getInProgressAchievements = () => {
    return achievements.filter((a) => !a.completed)
  }

  return {
    achievements,
    isLoading,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    toggleSubTask,
    addSubTask,
    deleteSubTask,
    getCompletedAchievements,
    getInProgressAchievements,
  }
}
