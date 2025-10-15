"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Vice } from "@/lib/types"

interface ViceFormProps {
  onSubmit: (vice: Omit<Vice, "id" | "createdAt" | "daysClean" | "relapseHistory">) => void
  onCancel: () => void
  initialData?: Vice
}

export function ViceForm({ onSubmit, onCancel, initialData }: ViceFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [severity, setSeverity] = useState<"low" | "medium" | "high">(initialData?.severity || "medium")
  const [alternativeBehavior, setAlternativeBehavior] = useState(initialData?.alternativeBehavior || "")
  const [active, setActive] = useState(initialData?.active ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name,
      description: description || undefined,
      severity,
      alternativeBehavior: alternativeBehavior || undefined,
      active,
      lastRelapse: initialData?.lastRelapse,
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Vício</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Fumar, Redes Sociais..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o vício e como ele te afeta..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">Severidade</Label>
          <Select value={severity} onValueChange={(v) => setSeverity(v as "low" | "medium" | "high")}>
            <SelectTrigger id="severity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternative">Comportamento Alternativo</Label>
          <Textarea
            id="alternative"
            value={alternativeBehavior}
            onChange={(e) => setAlternativeBehavior(e.target.value)}
            placeholder="O que fazer quando sentir vontade? Ex: Beber água, caminhar..."
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="active" checked={active} onCheckedChange={(checked) => setActive(checked as boolean)} />
          <Label htmlFor="active" className="cursor-pointer text-sm font-normal">
            Vício ativo (estou trabalhando para superar)
          </Label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            {initialData ? "Atualizar" : "Adicionar"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
