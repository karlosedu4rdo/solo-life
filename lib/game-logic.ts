// Game logic and calculations for Solo Life

import type { Player, PlayerStats } from "./types"

// XP calculation - exponential curve
export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Calculate player level from total XP
export function calculateLevel(totalXP: number): number {
  let level = 1
  let xpNeeded = 0

  while (xpNeeded <= totalXP) {
    xpNeeded += calculateXPForLevel(level)
    if (xpNeeded <= totalXP) {
      level++
    }
  }

  return level
}

// Get current XP progress for current level
export function getCurrentLevelProgress(player: Player): {
  currentXP: number
  xpToNextLevel: number
  percentage: number
} {
  const xpToNextLevel = calculateXPForLevel(player.level + 1)
  const percentage = (player.currentXP / xpToNextLevel) * 100

  return {
    currentXP: player.currentXP,
    xpToNextLevel,
    percentage: Math.min(percentage, 100),
  }
}

// Add XP and check for level up
export function addXP(
  player: Player,
  xpAmount: number,
): {
  player: Player
  leveledUp: boolean
  newLevel?: number
} {
  const newCurrentXP = player.currentXP + xpAmount
  const xpToNextLevel = calculateXPForLevel(player.level + 1)

  if (newCurrentXP >= xpToNextLevel) {
    // Level up!
    return {
      player: {
        ...player,
        level: player.level + 1,
        currentXP: newCurrentXP - xpToNextLevel,
        xpToNextLevel: calculateXPForLevel(player.level + 2),
      },
      leveledUp: true,
      newLevel: player.level + 1,
    }
  }

  return {
    player: {
      ...player,
      currentXP: newCurrentXP,
    },
    leveledUp: false,
  }
}

// Update player stats
export function updateStats(player: Player, stat: keyof PlayerStats, amount: number): Player {
  return {
    ...player,
    stats: {
      ...player.stats,
      [stat]: Math.max(0, player.stats[stat] + amount),
    },
  }
}

// Calculate stat rank based on value
export function getStatRank(statValue: number): string {
  if (statValue >= 100) return "S"
  if (statValue >= 80) return "A"
  if (statValue >= 60) return "B"
  if (statValue >= 40) return "C"
  if (statValue >= 20) return "D"
  return "E"
}

// Get stat color based on value
export function getStatColor(statValue: number): string {
  if (statValue >= 80) return "text-primary"
  if (statValue >= 60) return "text-accent"
  if (statValue >= 40) return "text-secondary"
  return "text-muted-foreground"
}

// Initialize new player
export function createNewPlayer(name: string): Player {
  return {
    id: crypto.randomUUID(),
    name,
    level: 1,
    currentXP: 0,
    xpToNextLevel: calculateXPForLevel(2),
    stats: {
      willpower: 10,
      intelligence: 10,
      vitality: 10,
      wealth: 0,
    },
    titles: ["Novato"],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  }
}
