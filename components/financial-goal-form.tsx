"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface FinancialGoalFormProps {
  onSubmit: (goal: { name: string; targetAmount: number; currentAmount: number; deadline?: string }) => void
  onCancel: () => void
}

export function FinancialGoalForm({ onSubmit, onCancel }: FinancialGoalFormProps) {
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentAmount, setCurrentAmount] = useState("0")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: Number.parseFloat(currentAmount),
      deadline: deadline || undefined,
    })

    // Reset form
    setName("")
    setTargetAmount("")
    setCurrentAmount("0")
    setDeadline("")
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Meta</Label>
          <Input
            id="name"
            placeholder="Ex: Viagem para Europa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target">Valor Alvo (R$)</Label>
            <Input
              id="target"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current">Valor Atual (R$)</Label>
            <Input
              id="current"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Prazo (opcional)</Label>
          <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Criar Meta
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
