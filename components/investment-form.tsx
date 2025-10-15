"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, TrendingUp } from "lucide-react"
import type { Investment } from "@/lib/types"

interface InvestmentFormProps {
  initialData?: Investment
  onSubmit: (data: Omit<Investment, "id" | "createdAt">) => void
  onCancel: () => void
}

const investmentTypes = [
  { value: "stocks", label: "Ações" },
  { value: "bonds", label: "Títulos" },
  { value: "crypto", label: "Criptomoedas" },
  { value: "real_estate", label: "Imóveis" },
  { value: "funds", label: "Fundos" },
  { value: "other", label: "Outros" },
]

export function InvestmentForm({ initialData, onSubmit, onCancel }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "stocks",
    amount: initialData?.amount || 0,
    currentValue: initialData?.currentValue || 0,
    purchaseDate: initialData?.purchaseDate || new Date().toISOString().split("T")[0],
    description: initialData?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || formData.amount <= 0 || formData.currentValue < 0) {
      return
    }

    onSubmit({
      name: formData.name,
      type: formData.type as Investment["type"],
      amount: formData.amount,
      currentValue: formData.currentValue,
      purchaseDate: formData.purchaseDate,
      description: formData.description || undefined,
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const gainLoss = formData.currentValue - formData.amount
  const gainLossPercentage = formData.amount > 0 ? (gainLoss / formData.amount) * 100 : 0

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">
            {initialData ? "Editar Investimento" : "Novo Investimento"}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Investimento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Ações da Petrobras"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor Investido (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentValue">Valor Atual (R$)</Label>
            <Input
              id="currentValue"
              type="number"
              step="0.01"
              min="0"
              value={formData.currentValue}
              onChange={(e) => handleInputChange("currentValue", parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Data da Compra</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Observações sobre o investimento..."
            rows={3}
          />
        </div>

        {/* Gain/Loss Display */}
        {formData.amount > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Resultado:</span>
              <div className="text-right">
                <div className={`font-semibold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {gainLoss >= 0 ? "+" : ""}R$ {gainLoss.toFixed(2)}
                </div>
                <div className={`text-xs ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {gainLossPercentage >= 0 ? "+" : ""}{gainLossPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {initialData ? "Atualizar" : "Adicionar"} Investimento
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
