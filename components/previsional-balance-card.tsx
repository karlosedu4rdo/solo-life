"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrevisionalBalanceCardProps {
  balance: number
  fixedIncome: number
  fixedExpenses: number
}

export function PrevisionalBalanceCard({ balance, fixedIncome, fixedExpenses }: PrevisionalBalanceCardProps) {
  const getBalanceStatus = (balance: number) => {
    if (balance < 0) return { color: "red", label: "Crítico", icon: AlertTriangle }
    if (balance < 200) return { color: "orange", label: "Alerta", icon: AlertTriangle }
    if (balance < 500) return { color: "yellow", label: "Atenção", icon: AlertTriangle }
    if (balance < 1500) return { color: "green", label: "Bom", icon: CheckCircle2 }
    return { color: "blue", label: "Excelente", icon: Sparkles }
  }

  const status = getBalanceStatus(balance)
  const Icon = status.icon

  const colorClasses = {
    red: "from-red-500/20 to-red-900/20 border-red-500/50 text-red-500",
    orange: "from-orange-500/20 to-orange-900/20 border-orange-500/50 text-orange-500",
    yellow: "from-yellow-500/20 to-yellow-900/20 border-yellow-500/50 text-yellow-500",
    green: "from-green-500/20 to-green-900/20 border-green-500/50 text-green-500",
    blue: "from-blue-500/20 to-blue-900/20 border-blue-500/50 text-blue-500",
  }

  return (
    <Card
      className={cn(
        "border-2 bg-gradient-to-br p-6 transition-all duration-300",
        colorClasses[status.color as keyof typeof colorClasses],
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">Saldo Previsional</span>
          </div>
          <span className="rounded-full bg-background/50 px-3 py-1 text-xs font-semibold">{status.label}</span>
        </div>

        <div>
          <p className="text-4xl font-bold">R$ {balance.toFixed(2)}</p>
          <p className="mt-1 text-sm opacity-80">
            {balance < 0
              ? "Suas despesas fixas excedem suas receitas"
              : balance < 200
                ? "Margem muito pequena para imprevistos"
                : balance < 500
                  ? "Cuidado com gastos variáveis"
                  : balance < 1500
                    ? "Sobra saudável para investimentos"
                    : "Excelente controle financeiro!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-current/20 pt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs opacity-80">
              <TrendingUp className="h-3 w-3" />
              <span>Receitas Fixas</span>
            </div>
            <p className="text-lg font-semibold">R$ {fixedIncome.toFixed(2)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs opacity-80">
              <TrendingDown className="h-3 w-3" />
              <span>Despesas Fixas</span>
            </div>
            <p className="text-lg font-semibold">R$ {fixedExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
