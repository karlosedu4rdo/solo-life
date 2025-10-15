"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Skull } from "lucide-react"

interface PenaltyMissionModalProps {
  failedCount: number
  onAccept: () => void
  onDismiss: () => void
}

export function PenaltyMissionModal({ failedCount, onAccept, onDismiss }: PenaltyMissionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border-destructive bg-gradient-to-br from-destructive/10 to-card p-6">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
            <Skull className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <div>
            <h2 className="text-2xl font-bold text-destructive">Missão de Penalidade Ativada!</h2>
            <p className="mt-2 text-muted-foreground">Você falhou em {failedCount} missões nos últimos 7 dias.</p>
          </div>

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="mb-2 flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-foreground">Missão Obrigatória</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete 100 flexões OU corra 5km OU medite por 30 minutos nas próximas 24 horas para limpar sua
              penalidade.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Consequências por não completar:</p>
            <ul className="space-y-1">
              <li>• -50 XP</li>
              <li>• -5 em todas as estatísticas</li>
              <li>• Perda de streak atual</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={onAccept} variant="destructive" className="flex-1">
              Aceitar Desafio
            </Button>
            <Button onClick={onDismiss} variant="outline">
              Depois
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
