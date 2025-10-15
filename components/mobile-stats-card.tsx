"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Trophy, 
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatData {
  label: string
  value: number
  previousValue: number
  unit: string
  trend: "up" | "down" | "stable"
  color: string
  icon: React.ComponentType<{ className?: string }>
}

interface MobileStatsCardProps {
  title: string
  stats: StatData[]
  period: "week" | "month" | "year"
  onPeriodChange: (period: "week" | "month" | "year") => void
}

export function MobileStatsCard({ 
  title, 
  stats, 
  period, 
  onPeriodChange 
}: MobileStatsCardProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setAnimatedValues(stats.map(stat => stat.value))
      setIsAnimating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [stats])

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <ArrowUp className="h-3 w-3 text-green-500" />
      case "down": return <ArrowDown className="h-3 w-3 text-red-500" />
      default: return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return "text-green-600"
      case "down": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-card to-muted/20 border-2 border-primary/10">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-sm">{title}</h3>
          </div>
          
          <div className="flex gap-1">
            {(["week", "month", "year"] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(p)}
                className="h-7 px-2 text-xs"
              >
                {p === "week" ? "7d" : p === "month" ? "30d" : "1a"}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const change = calculateChange(stat.value, stat.previousValue)
            const animatedValue = animatedValues[index] || 0

            return (
              <div 
                key={stat.label}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-300",
                  stat.color,
                  isAnimating && "scale-105"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={cn(
                      "text-xs font-bold",
                      getTrendColor(stat.trend)
                    )}>
                      {change > 0 ? "+" : ""}{change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">
                      {Math.round(animatedValue).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.unit}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    vs. anterior: {stat.previousValue.toLocaleString()} {stat.unit}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Resumo do Período</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {period === "week" ? "7 dias" : period === "month" ? "30 dias" : "1 ano"}
            </Badge>
          </div>
          
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {stats.filter(s => s.trend === "up").length}
              </div>
              <div className="text-xs text-muted-foreground">Crescendo</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {stats.filter(s => s.trend === "down").length}
              </div>
              <div className="text-xs text-muted-foreground">Declinando</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">
                {stats.filter(s => s.trend === "stable").length}
              </div>
              <div className="text-xs text-muted-foreground">Estável</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
