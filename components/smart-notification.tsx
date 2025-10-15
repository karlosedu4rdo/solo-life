"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Target,
  Zap,
  Trophy,
  Clock,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartNotification {
  id: string
  type: "achievement" | "reminder" | "motivation" | "warning" | "info"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  action?: {
    label: string
    onClick: () => void
  }
  dismissible: boolean
  autoHide?: number // in seconds
  icon?: React.ComponentType<{ className?: string }>
}

interface SmartNotificationProps {
  notification: SmartNotification
  onDismiss: (id: string) => void
  onAction?: (id: string) => void
}

const typeIcons = {
  achievement: Trophy,
  reminder: Clock,
  motivation: TrendingUp,
  warning: AlertTriangle,
  info: Info,
}

const typeColors = {
  achievement: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reminder: "bg-blue-100 text-blue-800 border-blue-200",
  motivation: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-orange-100 text-orange-800 border-orange-200",
  info: "bg-gray-100 text-gray-800 border-gray-200",
}

const priorityColors = {
  low: "border-l-2 border-l-gray-300",
  medium: "border-l-2 border-l-blue-400",
  high: "border-l-2 border-l-orange-400",
  urgent: "border-l-2 border-l-red-400 animate-pulse",
}

export function SmartNotification({ 
  notification, 
  onDismiss, 
  onAction 
}: SmartNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const Icon = notification.icon || typeIcons[notification.type]

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
      setIsAnimating(true)
    }, 100)

    // Auto hide
    if (notification.autoHide) {
      const hideTimer = setTimeout(() => {
        handleDismiss()
      }, notification.autoHide * 1000)
      return () => clearTimeout(hideTimer)
    }

    return () => clearTimeout(timer)
  }, [notification.autoHide])

  const handleDismiss = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onDismiss(notification.id)
    }, 300)
  }

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick()
      if (onAction) {
        onAction(notification.id)
      }
    }
  }

  return (
    <div className={cn(
      "fixed top-4 left-4 right-4 z-50 transform transition-all duration-300 ease-out",
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      <Card className={cn(
        "p-4 border-2 shadow-lg backdrop-blur-sm bg-card/95",
        typeColors[notification.type],
        priorityColors[notification.priority],
        isAnimating && "scale-105"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full flex-shrink-0",
            typeColors[notification.type]
          )}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm truncate">{notification.title}</h3>
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5"
                  >
                    {notification.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {notification.message}
                </p>
              </div>
              
              {notification.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 hover:bg-black/10 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Action Button */}
            {notification.action && (
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleAction}
                  size="sm"
                  className="h-8 text-xs"
                >
                  {notification.action.label}
                </Button>
                
                {notification.dismissible && (
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                  >
                    Dispensar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// Notification Manager Component
interface NotificationManagerProps {
  notifications: SmartNotification[]
  onDismiss: (id: string) => void
  onAction?: (id: string) => void
}

export function NotificationManager({ 
  notifications, 
  onDismiss, 
  onAction 
}: NotificationManagerProps) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <SmartNotification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          onAction={onAction}
        />
      ))}
    </div>
  )
}
