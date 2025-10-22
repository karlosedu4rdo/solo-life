"use client"

import { useState, useEffect, useCallback } from "react"
import type { Player } from "@/lib/types"
import { createNewPlayer, addXP, updateStats } from "@/lib/game-logic"
import type { PlayerStats } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { UserOperations } from "@/lib/kv-database"

export function usePlayer() {
  const { user } = useAuth()
  const [player, setPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side and when user is available
    if (typeof window === 'undefined' || !user) {
      setIsLoading(false)
      return
    }
    
    const loadPlayerData = async () => {
      try {
        const savedPlayer = await UserOperations.loadUserPlayer(user.id)
        if (savedPlayer) {
          setPlayer(savedPlayer)
        }
        setError(null)
      } catch (err) {
        console.error("[usePlayer] Error loading player:", err)
        setError("Failed to load player data")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPlayerData()
  }, [user])

  useEffect(() => {
    if (player && user) {
      const savePlayerData = async () => {
        try {
          await UserOperations.saveUserPlayer(user.id, player)
          setError(null)
        } catch (err) {
          console.error("[usePlayer] Error saving player:", err)
          setError("Failed to save player data")
        }
      }
      
      savePlayerData()
    }
  }, [player, user])

  const initializePlayer = useCallback((name: string) => {
    try {
      const newPlayer = createNewPlayer(name)
      setPlayer(newPlayer)
      setError(null)
    } catch (err) {
      console.error("[usePlayer] Error initializing player:", err)
      setError("Failed to create player")
    }
  }, [])

  const gainXP = useCallback(
    (amount: number) => {
      if (!player) return { leveledUp: false }

      try {
        const result = addXP(player, amount)
        setPlayer(result.player)
        setError(null)

        return {
          leveledUp: result.leveledUp,
          newLevel: result.newLevel,
        }
      } catch (err) {
        console.error("[usePlayer] Error gaining XP:", err)
        setError("Failed to add XP")
        return { leveledUp: false }
      }
    },
    [player],
  )

  const modifyStat = useCallback(
    (stat: keyof PlayerStats, amount: number) => {
      if (!player) return

      try {
        const updatedPlayer = updateStats(player, stat, amount)
        setPlayer(updatedPlayer)
        setError(null)
      } catch (err) {
        console.error("[usePlayer] Error modifying stat:", err)
        setError("Failed to update stats")
      }
    },
    [player],
  )

  const addTitle = useCallback(
    (title: string) => {
      if (!player) return

      try {
        if (!player.titles.includes(title)) {
          setPlayer({
            ...player,
            titles: [...player.titles, title],
          })
        }
        setError(null)
      } catch (err) {
        console.error("[usePlayer] Error adding title:", err)
        setError("Failed to add title")
      }
    },
    [player],
  )

  const updateProfile = useCallback(
    (updates: { name?: string; avatar?: string; bio?: string }) => {
      if (!player) return

      try {
        setPlayer({
          ...player,
          ...updates,
        })
        setError(null)
      } catch (err) {
        console.error("[usePlayer] Error updating profile:", err)
        setError("Failed to update profile")
      }
    },
    [player],
  )

  return {
    player,
    isLoading,
    error,
    initializePlayer,
    gainXP,
    modifyStat,
    addTitle,
    updateProfile,
  }
}
