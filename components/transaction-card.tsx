"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/lib/types"
import { ArrowUpRight, ArrowDownRight, Trash2, Edit, Repeat } from "lucide-react"

interface TransactionCardProps {
  transaction: Transaction
  onDelete: (id: string) => void
  onEdit?: (transaction: Transaction) => void
}

export function TransactionCard({ transaction, onDelete, onEdit }: TransactionCardProps) {
  const isIncome = transaction.type === "income"
  const date = new Date(transaction.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <Card className="p-4 transition-all hover:border-primary/50">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            isIncome ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
          }`}
        >
          {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{transaction.description}</h4>
                {transaction.isFixed && (
                  <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-xs">
                    <Repeat className="h-3 w-3" />
                    Fixa
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${isIncome ? "text-accent" : "text-destructive"}`}>
                {isIncome ? "+" : "-"}R$ {transaction.amount.toFixed(2)}
              </p>
              <Badge variant="outline" className="mt-1">
                {transaction.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(transaction)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(transaction.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
