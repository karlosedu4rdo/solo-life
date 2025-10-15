"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { CultureItem, CultureType, CultureStatus } from "@/lib/types"
import { Book, Tv, Film, BookOpen } from "lucide-react"

interface CultureItemFormProps {
  onSubmit: (item: Omit<CultureItem, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
  initialData?: CultureItem
}

const typeIcons = {
  book: Book,
  series: Tv,
  anime: Film,
  manga: BookOpen,
}

const statusLabels = {
  planning: "Planejando",
  "in-progress": "Em Progresso",
  completed: "Completo",
  dropped: "Abandonado",
  "on-hold": "Em Pausa",
}

const progressUnits = {
  book: "pages",
  series: "episodes",
  anime: "episodes",
  manga: "chapters",
} as const

export function CultureItemForm({ onSubmit, onCancel, initialData }: CultureItemFormProps) {
  const [type, setType] = useState<CultureType>(initialData?.type || "book")
  const [title, setTitle] = useState(initialData?.title || "")
  const [author, setAuthor] = useState(initialData?.author || "")
  const [genre, setGenre] = useState(initialData?.genre || "")
  const [status, setStatus] = useState<CultureStatus>(initialData?.status || "planning")
  const [rating, setRating] = useState(initialData?.rating?.toString() || "")
  const [currentProgress, setCurrentProgress] = useState(initialData?.progress?.current.toString() || "")
  const [totalProgress, setTotalProgress] = useState(initialData?.progress?.total.toString() || "")
  const [notes, setNotes] = useState(initialData?.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const item: Omit<CultureItem, "id" | "createdAt" | "updatedAt"> = {
      type,
      title,
      author: author || undefined,
      genre: genre || undefined,
      status,
      rating: rating ? Number.parseInt(rating) : undefined,
      progress:
        currentProgress || totalProgress
          ? {
              current: Number.parseInt(currentProgress) || 0,
              total: Number.parseInt(totalProgress) || 0,
              unit: progressUnits[type],
            }
          : undefined,
      notes: notes || undefined,
      startDate: status !== "planning" ? new Date().toISOString() : undefined,
      endDate: status === "completed" ? new Date().toISOString() : undefined,
    }

    onSubmit(item)
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(typeIcons) as CultureType[]).map((t) => {
              const Icon = typeIcons[t]
              return (
                <Button
                  key={t}
                  type="button"
                  variant={type === t ? "default" : "outline"}
                  onClick={() => setType(t)}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs capitalize">{t}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome do livro, série, anime ou manga"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Autor/Criador</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nome do autor" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Gênero</Label>
            <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ficção, Ação..." />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as CultureStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current">Progresso Atual</Label>
            <Input
              id="current"
              type="number"
              min="0"
              value={currentProgress}
              onChange={(e) => setCurrentProgress(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total">Total</Label>
            <Input
              id="total"
              type="number"
              min="0"
              value={totalProgress}
              onChange={(e) => setTotalProgress(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Avaliação (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Suas impressões, comentários..."
            rows={3}
          />
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
