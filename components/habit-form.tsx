"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { HabitCategory, HabitFrequency } from "@/lib/types"
import type { PlayerStats } from "@/lib/types"

interface HabitFormProps {
  onSubmit: (habit: {
    name: string
    description?: string
    category: HabitCategory
    frequency: HabitFrequency
    xpReward: number
    statReward?: {
      stat: keyof PlayerStats
      amount: number
    }
    penalty?: {
      type: "xp" | "stat"
      amount: number
      stat?: keyof PlayerStats
    }
    active: boolean
  }) => void
  onCancel: () => void
}

export function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<HabitCategory>("health")
  const [frequency, setFrequency] = useState<HabitFrequency>("daily")
  const [xpReward, setXpReward] = useState(50)
  const [statRewardEnabled, setStatRewardEnabled] = useState(false)
  const [statRewardType, setStatRewardType] = useState<keyof PlayerStats>("willpower")
  const [statRewardAmount, setStatRewardAmount] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name,
      description: description || undefined,
      category,
      frequency,
      xpReward,
      statReward: statRewardEnabled
        ? {
            stat: statRewardType,
            amount: statRewardAmount,
          }
        : undefined,
      active: true,
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Hábito</Label>
          <Input
            id="name"
            placeholder="Ex: Beber 2L de água"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Detalhes sobre o hábito..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as HabitCategory)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Saúde</SelectItem>
                <SelectItem value="study">Estudo</SelectItem>
                <SelectItem value="creativity">Criatividade</SelectItem>
                <SelectItem value="finance">Finanças</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as HabitFrequency)}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="xp">Recompensa de XP</Label>
          <Input
            id="xp"
            type="number"
            min="10"
            max="500"
            value={xpReward}
            onChange={(e) => setXpReward(Number(e.target.value))}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="statReward"
              checked={statRewardEnabled}
              onChange={(e) => setStatRewardEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="statReward" className="cursor-pointer">
              Adicionar Recompensa de Estatística
            </Label>
          </div>

          {statRewardEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statType">Estatística</Label>
                <Select value={statRewardType} onValueChange={(value) => setStatRewardType(value as keyof PlayerStats)}>
                  <SelectTrigger id="statType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="willpower">Poder de Vontade</SelectItem>
                    <SelectItem value="intelligence">Inteligência</SelectItem>
                    <SelectItem value="vitality">Vitalidade</SelectItem>
                    <SelectItem value="wealth">Riqueza</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statAmount">Quantidade</Label>
                <Input
                  id="statAmount"
                  type="number"
                  min="1"
                  max="10"
                  value={statRewardAmount}
                  onChange={(e) => setStatRewardAmount(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Criar Hábito
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
