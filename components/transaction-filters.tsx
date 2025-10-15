"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Filter, X } from "lucide-react"

interface TransactionFiltersProps {
  filters: {
    type: "all" | "income" | "expense"
    category: string
    startDate: string
    endDate: string
    isFixed: "all" | "fixed" | "variable"
  }
  onFilterChange: (filters: any) => void
  categories: string[]
}

export function TransactionFilters({ filters, onFilterChange, categories }: TransactionFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      type: "all",
      category: "all",
      startDate: "",
      endDate: "",
      isFixed: "all",
    })
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label className="text-xs">Tipo</Label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange({ ...filters, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Categoria</Label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange({ ...filters, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Recorrência</Label>
          <Select value={filters.isFixed} onValueChange={(value) => onFilterChange({ ...filters, isFixed: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="fixed">Fixas</SelectItem>
              <SelectItem value="variable">Variáveis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Data Inicial</Label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Data Final</Label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>
    </Card>
  )
}
