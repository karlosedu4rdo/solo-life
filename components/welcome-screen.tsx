"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface WelcomeScreenProps {
  onStart: (name: string) => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onStart(name.trim())
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 border-primary/20 bg-gradient-to-br from-card to-card/50 p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Solo Life</h1>
          <p className="text-muted-foreground">Transforme sua vida em uma jornada épica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Como devemos te chamar?</Label>
            <Input
              id="name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-lg"
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={!name.trim()}>
            Começar Jornada
          </Button>
        </form>

        <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Sistema de Progressão:</p>
          <ul className="space-y-1 text-xs">
            <li>• Complete missões diárias para ganhar XP</li>
            <li>• Aumente suas estatísticas através de hábitos</li>
            <li>• Desbloqueie títulos e conquistas</li>
            <li>• Gerencie suas finanças como um tesouro</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
