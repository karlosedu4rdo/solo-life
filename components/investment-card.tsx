"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign
} from "lucide-react"
import type { Investment } from "@/lib/types"

interface InvestmentCardProps {
  investment: Investment
  onEdit: (investment: Investment) => void
  onDelete: (id: string) => void
}

const investmentTypeLabels = {
  stocks: "Ações",
  bonds: "Títulos",
  crypto: "Criptomoedas",
  real_estate: "Imóveis",
  funds: "Fundos",
  other: "Outros",
}

const investmentTypeColors = {
  stocks: "bg-blue-100 text-blue-800",
  bonds: "bg-green-100 text-green-800",
  crypto: "bg-orange-100 text-orange-800",
  real_estate: "bg-purple-100 text-purple-800",
  funds: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800",
}

export function InvestmentCard({ investment, onEdit, onDelete }: InvestmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const gainLoss = investment.currentValue - investment.amount
  const gainLossPercentage = investment.amount > 0 ? (gainLoss / investment.amount) * 100 : 0
  const isGain = gainLoss >= 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const handleDelete = () => {
    setIsDeleting(true)
    onDelete(investment.id)
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{investment.name}</h3>
            <Badge 
              variant="secondary" 
              className={`text-xs ${investmentTypeColors[investment.type]}`}
            >
              {investmentTypeLabels[investment.type]}
            </Badge>
          </div>
          {investment.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {investment.description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(investment)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete} 
              className="text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>Investido</span>
            </div>
            <p className="font-medium">R$ {investment.amount.toFixed(2)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Valor Atual</span>
            </div>
            <p className="font-medium">R$ {investment.currentValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Comprado em {formatDate(investment.purchaseDate)}</span>
          </div>

          <div className="text-right">
            <div className={`flex items-center gap-1 font-semibold ${
              isGain ? "text-green-600" : "text-red-600"
            }`}>
              {isGain ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {isGain ? "+" : ""}R$ {gainLoss.toFixed(2)}
              </span>
            </div>
            <div className={`text-xs ${isGain ? "text-green-600" : "text-red-600"}`}>
              {isGain ? "+" : ""}{gainLossPercentage.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
