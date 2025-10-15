"use client"

import { useState } from "react"
import { useCulture } from "@/hooks/use-culture"
import { usePlayer } from "@/hooks/use-player"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CultureItemForm } from "@/components/culture-item-form"
import { CultureItemCard } from "@/components/culture-item-card"
import { Plus, Book, Tv, Film, BookOpen, AlertCircle } from "lucide-react"
import type { CultureItem, CultureType } from "@/lib/types"

export default function CulturePage() {
  const { items, isLoading, addItem, updateItem, deleteItem, getItemsByType, getStats } = useCulture()
  const { modifyStat } = usePlayer()
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<CultureItem | null>(null)
  const [filterType, setFilterType] = useState<CultureType | "all">("all")

  const stats = getStats()

  const filteredItems = filterType === "all" ? items : getItemsByType(filterType)

  const handleAddItem = (itemData: Parameters<typeof addItem>[0]) => {
    addItem(itemData)
    setShowForm(false)

    if (itemData.status === "completed") {
      modifyStat("intelligence", 5)
    }
  }

  const handleUpdateItem = (itemData: Parameters<typeof addItem>[0]) => {
    if (editingItem) {
      const wasCompleted = editingItem.status === "completed"
      const isNowCompleted = itemData.status === "completed"

      updateItem(editingItem.id, itemData)
      setEditingItem(null)

      if (!wasCompleted && isNowCompleted) {
        modifyStat("intelligence", 5)
      }
    }
  }

  const handleEdit = (item: CultureItem) => {
    setEditingItem(item)
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-4xl space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cultura</h1>
            <p className="text-sm text-muted-foreground">Biblioteca Pessoal</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingItem(null)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-foreground">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="space-y-1 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <Book className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{stats.byType.book}</p>
              </div>
              <p className="text-xs text-muted-foreground">Livros</p>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <Tv className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{stats.byType.series}</p>
              </div>
              <p className="text-xs text-muted-foreground">Séries</p>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <Film className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{stats.byType.anime}</p>
              </div>
              <p className="text-xs text-muted-foreground">Animes</p>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{stats.byType.manga}</p>
              </div>
              <p className="text-xs text-muted-foreground">Mangás</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")}>
            Todos ({stats.total})
          </Button>
          <Button
            variant={filterType === "book" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("book")}
          >
            <Book className="mr-1 h-3 w-3" />
            Livros ({stats.byType.book})
          </Button>
          <Button
            variant={filterType === "series" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("series")}
          >
            <Tv className="mr-1 h-3 w-3" />
            Séries ({stats.byType.series})
          </Button>
          <Button
            variant={filterType === "anime" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("anime")}
          >
            <Film className="mr-1 h-3 w-3" />
            Animes ({stats.byType.anime})
          </Button>
          <Button
            variant={filterType === "manga" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("manga")}
          >
            <BookOpen className="mr-1 h-3 w-3" />
            Mangás ({stats.byType.manga})
          </Button>
        </div>

        {showForm && <CultureItemForm onSubmit={handleAddItem} onCancel={() => setShowForm(false)} />}

        {editingItem && (
          <CultureItemForm
            initialData={editingItem}
            onSubmit={handleUpdateItem}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {filteredItems.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-dashed py-12 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {items.length === 0 ? "Nenhum item adicionado" : "Nenhum item encontrado"}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {items.length === 0
                ? "Comece adicionando livros, séries, animes ou mangás"
                : "Tente selecionar outro filtro"}
            </p>
            {items.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <CultureItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={deleteItem} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
