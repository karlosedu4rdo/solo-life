"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { CultureItem } from "@/lib/types"
import { Book, Tv, Film, BookOpen, Edit, Trash2, Star } from "lucide-react"

interface CultureItemCardProps {
  item: CultureItem
  onEdit: (item: CultureItem) => void
  onDelete: (id: string) => void
}

const typeIcons = {
  book: Book,
  series: Tv,
  anime: Film,
  manga: BookOpen,
}

const statusColors = {
  planning: "bg-blue-500/20 text-blue-500 border-blue-500/50",
  "in-progress": "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  completed: "bg-green-500/20 text-green-500 border-green-500/50",
  dropped: "bg-red-500/20 text-red-500 border-red-500/50",
  "on-hold": "bg-gray-500/20 text-gray-500 border-gray-500/50",
}

const statusLabels = {
  planning: "Planejando",
  "in-progress": "Em Progresso",
  completed: "Completo",
  dropped: "Abandonado",
  "on-hold": "Em Pausa",
}

export function CultureItemCard({ item, onEdit, onDelete }: CultureItemCardProps) {
  const Icon = typeIcons[item.type]
  const progressPercent = item.progress ? (item.progress.current / item.progress.total) * 100 : 0

  return (
    <Card className="p-4 transition-all hover:border-primary/50">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              {item.author && <p className="text-sm text-muted-foreground">{item.author}</p>}
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusColors[item.status]}>
              {statusLabels[item.status]}
            </Badge>
            {item.genre && <Badge variant="secondary">{item.genre}</Badge>}
            {item.rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-semibold">{item.rating}/5</span>
              </div>
            )}
          </div>

          {item.progress && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {item.progress.current} / {item.progress.total} {item.progress.unit}
                </span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {item.notes && <p className="text-sm text-muted-foreground line-clamp-2">{item.notes}</p>}
        </div>
      </div>
    </Card>
  )
}
