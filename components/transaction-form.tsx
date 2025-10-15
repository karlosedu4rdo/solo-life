"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Transaction } from "@/lib/types"

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: "income" | "expense"
    amount: number
    category: string
    description: string
    date: string
    isFixed?: boolean
  }) => void
  onCancel: () => void
  initialData?: Transaction
}

const incomeCategories = ["Salário", "Freelance", "Investimento", "Presente", "Outro"]

const expenseCategories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Contas",
  "Outro",
]

export function TransactionForm({ onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(initialData?.type || "expense")
  const [amount, setAmount] = useState(initialData?.amount.toString() || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  )
  const [isFixed, setIsFixed] = useState(initialData?.isFixed || false)

  const categories = type === "income" ? incomeCategories : expenseCategories

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setAmount(initialData.amount.toString())
      setCategory(initialData.category)
      setDescription(initialData.description)
      setDate(new Date(initialData.date).toISOString().split("T")[0])
      setIsFixed(initialData.isFixed || false)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      type,
      amount: Number.parseFloat(amount),
      category: category || categories[0],
      description,
      date: new Date(date).toISOString(),
      isFixed,
    })

    if (!initialData) {
      setAmount("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
      setIsFixed(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              onClick={() => {
                setType("income")
                setCategory("")
              }}
              className="w-full"
            >
              Receita
            </Button>
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => {
                setType("expense")
                setCategory("")
              }}
              className="w-full"
            >
              Despesa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Detalhes da transação..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="isFixed" checked={isFixed} onCheckedChange={(checked) => setIsFixed(checked as boolean)} />
          <Label htmlFor="isFixed" className="cursor-pointer text-sm font-normal">
            Transação fixa (recorrente mensalmente)
          </Label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            {initialData ? "Atualizar" : "Adicionar"} Transação
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
