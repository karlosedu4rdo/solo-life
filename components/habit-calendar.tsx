"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { useState } from "react"
import type { Habit } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HabitCalendarProps {
  habit: Habit
  onToggleDay: (date: string) => void
  onClose: () => void
}

export function HabitCalendar({ habit, onToggleDay, onClose }: HabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  const isDateCompleted = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return habit.completionHistory.some((d) => d.startsWith(dateStr))
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00`
    onToggleDay(dateStr)
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{habit.name}</h3>
          {habit.streak > 0 && (
            <div className="mt-1 flex items-center gap-1 text-sm text-primary">
              <Flame className="h-4 w-4" />
              <span className="font-semibold">{habit.streak} dias de sequência</span>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h4 className="text-lg font-semibold capitalize text-foreground">{monthName}</h4>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const completed = isDateCompleted(day)
          const isToday =
            day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all",
                completed
                  ? "bg-primary text-primary-foreground hover:bg-primary/80"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
                isToday && "ring-2 ring-accent",
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        <p>Clique em um dia para marcar/desmarcar a conclusão do hábito.</p>
      </div>
    </Card>
  )
}
