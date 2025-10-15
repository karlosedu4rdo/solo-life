"use client"

import { useEffect, useState } from "react"
import { usePlayer } from "@/hooks/use-player"
import { useHabits } from "@/hooks/use-habits"
import { WelcomeScreen } from "@/components/welcome-screen"
import { MobileNav } from "@/components/mobile-nav"
import { DailyProgressCard } from "@/components/daily-progress-card"
import { DailyChallengeCard } from "@/components/daily-challenge-card"
import { MobileStatsCard } from "@/components/mobile-stats-card"
import { SmartNotification, NotificationManager } from "@/components/smart-notification"
import { GamifiedOnboarding } from "@/components/gamified-onboarding"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Trophy, 
  Star, 
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  Flame,
  BarChart3,
  Wallet,
  Dumbbell,
  BookOpen,
  AlertTriangle,
  Brain,
  Heart,
  Coins,
  Bell,
  User
} from "lucide-react"
import type { DailyMission } from "@/lib/types"
import { getCurrentLevelProgress } from "@/lib/game-logic"

// Mock data for demonstration
const mockDailyChallenges = [
  {
    id: "1",
    title: "Leitura Diária",
    description: "Leia por 30 minutos para expandir sua mente",
    category: "study" as const,
    difficulty: "medium" as const,
    xpReward: 50,
    timeEstimate: 30,
    progress: 0,
    completed: false,
    streakBonus: 10,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Exercício Cardio",
    description: "Faça 20 minutos de exercício cardiovascular",
    category: "health" as const,
    difficulty: "hard" as const,
    xpReward: 75,
    timeEstimate: 20,
    progress: 0,
    completed: false,
    streakBonus: 15,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockNotifications = [
  {
    id: "1",
    type: "achievement" as const,
    title: "Primeira Conquista!",
    message: "Você completou seu primeiro hábito! Continue assim!",
    priority: "high" as const,
    dismissible: true,
    autoHide: 5,
  },
  {
    id: "2",
    type: "reminder" as const,
    title: "Lembrete de Hábito",
    message: "Não esqueça de completar sua leitura diária!",
    priority: "medium" as const,
    dismissible: true,
    autoHide: 10,
  },
]

const mockStats = [
  {
    label: "Hábitos Completos",
    value: 12,
    previousValue: 8,
    unit: "hoje",
    trend: "up" as const,
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Target,
  },
  {
    label: "XP Ganho",
    value: 450,
    previousValue: 320,
    unit: "XP",
    trend: "up" as const,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Zap,
  },
  {
    label: "Sequência Atual",
    value: 7,
    previousValue: 5,
    unit: "dias",
    trend: "up" as const,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Flame,
  },
  {
    label: "Nível Atual",
    value: 5,
    previousValue: 4,
    unit: "",
    trend: "up" as const,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Trophy,
  },
]

export default function MobileDashboardPage() {
  const { player, isLoading, initializePlayer, gainXP, modifyStat } = usePlayer()
  const { habits, completeHabit: completeHabitInStorage } = useHabits()
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [dailyChallenges, setDailyChallenges] = useState(mockDailyChallenges)
  const [statsPeriod, setStatsPeriod] = useState<"week" | "month" | "year">("week")

  useEffect(() => {
    if (player && habits) {
      const today = new Date().toISOString().split("T")[0]
      const missions = habits
        .filter((habit) => habit.active && habit.frequency === "daily")
        .map((habit) => ({
          id: habit.id,
          habitId: habit.id,
          name: habit.name,
          category: habit.category,
          completed: habit.completionHistory.some((d) => d.startsWith(today)),
          xpReward: habit.xpReward,
          statReward: habit.statReward,
        }))
      setDailyMissions(missions)
    }
  }, [player, habits])

  // Check if user needs onboarding
  useEffect(() => {
    if (player && player.level === 1 && player.currentXP === 0) {
      setShowOnboarding(true)
    }
  }, [player])

  const handleCompleteMission = (missionId: string) => {
    const mission = dailyMissions.find((m) => m.id === missionId)
    if (!mission || mission.completed) return

    completeHabitInStorage(missionId)
    gainXP(mission.xpReward)

    if (mission.statReward) {
      modifyStat(mission.statReward.stat, mission.statReward.amount)
    }
  }

  const handleChallengeStart = (challengeId: string) => {
    setDailyChallenges(prev => 
      prev.map(c => 
        c.id === challengeId 
          ? { ...c, progress: 25 } 
          : c
      )
    )
  }

  const handleChallengeComplete = (challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId)
    if (challenge) {
      gainXP(challenge.xpReward + challenge.streakBonus)
      setDailyChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, completed: true, progress: 100 } 
            : c
        )
      )
    }
  }

  const handleChallengeSkip = (challengeId: string) => {
    setDailyChallenges(prev => prev.filter(c => c.id !== challengeId))
  }

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    gainXP(100) // Bonus XP for completing onboarding
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!player) {
    return <WelcomeScreen onStart={initializePlayer} />
  }

  if (showOnboarding) {
    const onboardingSteps = [
      {
        id: "profile",
        title: "Configure seu Perfil",
        description: "Personalize seu avatar e informações básicas",
        icon: User,
        xpReward: 25,
        completed: false,
      },
      {
        id: "habits",
        title: "Crie seus Primeiros Hábitos",
        description: "Defina 3 hábitos que você quer desenvolver",
        icon: Target,
        xpReward: 50,
        completed: false,
      },
      {
        id: "goals",
        title: "Estabeleça Metas",
        description: "Defina objetivos para sua jornada",
        icon: Trophy,
        xpReward: 75,
        completed: false,
      },
    ]

    return (
      <GamifiedOnboarding
        steps={onboardingSteps}
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
      />
    )
  }

  const levelProgress = getCurrentLevelProgress(player)
  const completedMissions = dailyMissions.filter((m) => m.completed).length
  const totalMissions = dailyMissions.length

  const dailyProgress = {
    completedHabits: completedMissions,
    totalHabits: totalMissions,
    streak: 7, // Mock data
    todayXP: 450,
    weeklyGoal: 2000,
    weeklyProgress: 1350,
    nextMilestone: {
      xp: 1000,
      remaining: 550,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Mobile Navigation */}
      <MobileNav />

      {/* Notifications */}
      <NotificationManager
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />

      {/* Main Content */}
      <div className="pt-16 pb-24 px-4 space-y-4">
        {/* Daily Progress Card */}
        <DailyProgressCard 
          progress={dailyProgress}
          onViewDetails={() => {/* Navigate to habits */}}
        />

        {/* Daily Challenges */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Desafios Diários</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <DailyChallengeCard
                key={challenge.id}
                challenge={challenge}
                onStart={handleChallengeStart}
                onComplete={handleChallengeComplete}
                onSkip={handleChallengeSkip}
              />
            ))}
          </div>
        </Card>

        {/* Stats Card */}
        <MobileStatsCard
          title="Suas Estatísticas"
          stats={mockStats}
          period={statsPeriod}
          onPeriodChange={setStatsPeriod}
        />

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-bold text-sm mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-16 flex-col gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Target className="h-5 w-5" />
              <span className="text-xs">Hábitos</span>
            </Button>
            <Button className="h-16 flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Finanças</span>
            </Button>
            <Button className="h-16 flex-col gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <Dumbbell className="h-5 w-5" />
              <span className="text-xs">Treino</span>
            </Button>
            <Button className="h-16 flex-col gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Cultura</span>
            </Button>
          </div>
        </Card>

        {/* Level Progress */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Nível {player.level}</h3>
                <p className="text-xs text-muted-foreground">
                  {levelProgress.currentXP}/{levelProgress.xpToNextLevel} XP
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Math.round((levelProgress.currentXP / levelProgress.xpToNextLevel) * 100)}%
            </Badge>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${(levelProgress.currentXP / levelProgress.xpToNextLevel) * 100}%` }}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
