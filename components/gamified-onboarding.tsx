"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Zap, 
  Trophy, 
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  Crown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  xpReward: number
  completed: boolean
  action?: () => void
}

interface GamifiedOnboardingProps {
  steps: OnboardingStep[]
  onComplete: () => void
  onSkip: () => void
}

export function GamifiedOnboarding({ 
  steps, 
  onComplete, 
  onSkip 
}: GamifiedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [totalXP, setTotalXP] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const completedCount = completedSteps.size
  const progress = (completedCount / steps.length) * 100

  const handleStepComplete = (stepId: string, xpReward: number) => {
    setIsAnimating(true)
    setCompletedSteps(prev => new Set([...prev, stepId]))
    setTotalXP(prev => prev + xpReward)
    
    setTimeout(() => {
      setIsAnimating(false)
      if (completedCount + 1 === steps.length) {
        onComplete()
      } else {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
      }
    }, 500)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const currentStepData = steps[currentStep]
  const isCompleted = completedSteps.has(currentStepData.id)

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Bem-vindo ao Solo Life!</h1>
                <p className="text-sm text-muted-foreground">
                  Vamos configurar sua jornada épica
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-bold text-primary">
                <Zap className="h-4 w-4" />
                <span>{totalXP} XP</span>
              </div>
              <p className="text-xs text-muted-foreground">Ganho</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Progresso: {completedCount}/{steps.length}
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <Card className={cn(
            "p-6 h-full flex flex-col justify-center",
            isCompleted && "bg-green-50 border-green-200",
            isAnimating && "scale-105"
          )}>
            <div className="text-center space-y-4">
              {/* Icon */}
              <div className={cn(
                "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                isCompleted 
                  ? "bg-green-100 text-green-600" 
                  : "bg-primary/10 text-primary",
                isAnimating && "scale-110"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <currentStepData.icon className="h-8 w-8" />
                )}
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {isCompleted ? "🎉 Concluído!" : currentStepData.title}
                </h2>
                <p className="text-muted-foreground">
                  {isCompleted 
                    ? `Você ganhou ${currentStepData.xpReward} XP!` 
                    : currentStepData.description
                  }
                </p>
              </div>

              {/* XP Reward */}
              {!isCompleted && (
                <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-800">
                    +{currentStepData.xpReward} XP
                  </span>
                </div>
              )}

              {/* Motivational Message */}
              <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <p className="text-sm font-medium">
                  {isCompleted 
                    ? "Excelente! Vamos para o próximo passo! 🚀"
                    : "Complete este passo para continuar sua jornada épica! ⭐"
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Step Indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentStep 
                    ? "bg-primary w-6" 
                    : completedSteps.has(steps[index].id)
                    ? "bg-green-500"
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex-1"
              >
                Anterior
              </Button>
            )}
            
            {!isCompleted ? (
              <Button
                onClick={() => currentStepData.action?.() || handleStepComplete(currentStepData.id, currentStepData.xpReward)}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {currentStepData.action ? "Executar" : "Concluir"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Skip Button */}
          <Button
            onClick={onSkip}
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            Pular configuração
          </Button>
        </div>
      </div>
    </div>
  )
}
