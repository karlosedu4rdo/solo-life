"use client"

import { useState, useEffect } from "react"
import type { CultureItem, CultureType, CultureStatus } from "@/lib/types"
import { saveCultureItems, loadCultureItems } from "@/lib/storage"

export function useCulture() {
  const [items, setItems] = useState<CultureItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedItems = loadCultureItems()
    setItems(savedItems)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveCultureItems(items)
    }
  }, [items, isLoading])

  const addItem = (item: Omit<CultureItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: CultureItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setItems((prev) => [newItem, ...prev])
    return newItem
  }

  const updateItem = (id: string, updates: Partial<CultureItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getItemsByType = (type: CultureType) => {
    return items.filter((item) => item.type === type)
  }

  const getItemsByStatus = (status: CultureStatus) => {
    return items.filter((item) => item.status === status)
  }

  const getStats = () => {
    const byType = {
      book: items.filter((i) => i.type === "book").length,
      series: items.filter((i) => i.type === "series").length,
      anime: items.filter((i) => i.type === "anime").length,
      manga: items.filter((i) => i.type === "manga").length,
    }

    const byStatus = {
      planning: items.filter((i) => i.status === "planning").length,
      "in-progress": items.filter((i) => i.status === "in-progress").length,
      completed: items.filter((i) => i.status === "completed").length,
      dropped: items.filter((i) => i.status === "dropped").length,
      "on-hold": items.filter((i) => i.status === "on-hold").length,
    }

    return { byType, byStatus, total: items.length }
  }

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    getItemsByType,
    getItemsByStatus,
    getStats,
  }
}
