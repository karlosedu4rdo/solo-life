"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Trophy, Star, Zap, Target, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: "trophy" | "star" | "zap" | "target" | "trending"
  rarity: "common" | "rare" | "epic" | "legendary"
  xpReward: number
  unlockedAt: string
}

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
  autoClose?: boolean
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  trending: TrendingUp,
}

const rarityColors = {
  common: "bg-gray-100 text-gray-800 border-gray-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-purple-100 text-purple-800 border-purple-200",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export function AchievementNotification({ 
  achievement, 
  onClose, 
  autoClose = true 
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
      setIsAnimating(true)
    }, 100)

    // Auto close after 5 seconds
    if (autoClose) {
      const closeTimer = setTimeout(() => {
        handleClose()
      }, 5000)
      return () => clearTimeout(closeTimer)
    }

    return () => clearTimeout(timer)
  }, [autoClose])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const Icon = iconMap[achievement.icon]

  return (
    <div className={cn(
      "fixed top-4 left-4 right-4 z-50 transform transition-all duration-300 ease-out",
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      <Card className={cn(
        "p-4 border-2 shadow-lg backdrop-blur-sm bg-card/95",
        rarityColors[achievement.rarity],
        isAnimating && "animate-pulse"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            rarityColors[achievement.rarity]
          )}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm truncate">{achievement.title}</h3>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
              >
                {achievement.rarity.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-medium">
                <Star className="h-3 w-3" />
                <span>+{achievement.xpReward} XP</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-black/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
