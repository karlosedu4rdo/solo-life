"use client"

import { useState, useEffect } from "react"
import type { Vice } from "@/lib/types"
import { saveVices, loadVices } from "@/lib/storage"

export function useVices() {
  const [vices, setVices] = useState<Vice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedVices = loadVices()
    setVices(savedVices)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveVices(vices)
    }
  }, [vices, isLoading])

  const addVice = (vice: Omit<Vice, "id" | "createdAt" | "daysClean" | "relapseHistory">) => {
    const newVice: Vice = {
      ...vice,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      daysClean: 0,
      relapseHistory: [],
    }
    setVices((prev) => [...prev, newVice])
    return newVice
  }

  const updateVice = (id: string, updates: Partial<Vice>) => {
    setVices((prev) => prev.map((vice) => (vice.id === id ? { ...vice, ...updates } : vice)))
  }

  const deleteVice = (id: string) => {
    setVices((prev) => prev.filter((vice) => vice.id !== id))
  }

  const recordRelapse = (id: string) => {
    setVices((prev) =>
      prev.map((vice) => {
        if (vice.id !== id) return vice

        const now = new Date().toISOString()
        return {
          ...vice,
          daysClean: 0,
          lastRelapse: now,
          relapseHistory: [...vice.relapseHistory, now],
        }
      }),
    )
  }

  const updateDaysClean = () => {
    setVices((prev) =>
      prev.map((vice) => {
        if (!vice.active) return vice

        const lastRelapse = vice.lastRelapse ? new Date(vice.lastRelapse) : new Date(vice.createdAt)
        const today = new Date()
        const daysDiff = Math.floor((today.getTime() - lastRelapse.getTime()) / (1000 * 60 * 60 * 24))

        return {
          ...vice,
          daysClean: daysDiff,
        }
      }),
    )
  }

  useEffect(() => {
    if (!isLoading) {
      updateDaysClean()
    }
  }, [isLoading])

  return {
    vices,
    isLoading,
    addVice,
    updateVice,
    deleteVice,
    recordRelapse,
  }
}
