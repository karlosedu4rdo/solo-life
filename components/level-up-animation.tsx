"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp } from "lucide-react"

interface LevelUpAnimationProps {
  level: number
  onClose: () => void
}

export function LevelUpAnimation({ level, onClose }: LevelUpAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card className="relative overflow-hidden border-2 border-primary p-8 text-center animate-in zoom-in-95 duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse" />

        <div className="relative space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              <TrendingUp className="absolute inset-0 m-auto h-8 w-8 text-accent animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-primary animate-in slide-in-from-bottom-4 duration-700">
              Level Up!
            </h2>
            <p className="text-6xl font-black text-foreground animate-in slide-in-from-bottom-4 duration-700 delay-150">
              {level}
            </p>
            <p className="text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
              Continue sua jornada de evolução!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
