"use client"

import { useState } from "react"
import { useVices } from "@/hooks/use-vices"
import { usePlayer } from "@/hooks/use-player"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ViceForm } from "@/components/vice-form"
import { ViceCard } from "@/components/vice-card"
import { Plus, AlertCircle, TrendingDown } from "lucide-react"
import type { Vice } from "@/lib/types"

export default function VicesPage() {
  const { vices, isLoading, addVice, updateVice, deleteVice, recordRelapse } = useVices()
  const { modifyStat } = usePlayer()
  const [showForm, setShowForm] = useState(false)
  const [editingVice, setEditingVice] = useState<Vice | null>(null)

  const activeVices = vices.filter((v) => v.active)
  const totalDaysClean = activeVices.reduce((acc, v) => acc + v.daysClean, 0)
  const avgDaysClean = activeVices.length > 0 ? Math.floor(totalDaysClean / activeVices.length) : 0

  const handleAddVice = (viceData: Parameters<typeof addVice>[0]) => {
    addVice(viceData)
    setShowForm(false)
  }

  const handleUpdateVice = (viceData: Parameters<typeof addVice>[0]) => {
    if (editingVice) {
      updateVice(editingVice.id, viceData)
      setEditingVice(null)
    }
  }

  const handleRelapse = (id: string) => {
    recordRelapse(id)
    modifyStat("willpower", -5)
  }

  const handleEdit = (vice: Vice) => {
    setEditingVice(vice)
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
            <h1 className="text-2xl font-bold text-foreground">Vícios</h1>
            <p className="text-sm text-muted-foreground">Superação Pessoal</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingVice(null)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-destructive/10 to-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-foreground">Estatísticas</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1 text-center">
              <p className="text-3xl font-bold text-foreground">{activeVices.length}</p>
              <p className="text-xs text-muted-foreground">Vícios Ativos</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-3xl font-bold text-accent">{avgDaysClean}</p>
              <p className="text-xs text-muted-foreground">Média Dias Limpo</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-3xl font-bold text-primary">{totalDaysClean}</p>
              <p className="text-xs text-muted-foreground">Total Dias Limpo</p>
            </div>
          </div>
        </Card>

        {showForm && <ViceForm onSubmit={handleAddVice} onCancel={() => setShowForm(false)} />}

        {editingVice && (
          <ViceForm initialData={editingVice} onSubmit={handleUpdateVice} onCancel={() => setEditingVice(null)} />
        )}

        {vices.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-dashed py-12 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum vício registrado</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Adicione vícios que você quer superar e acompanhe seu progresso
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Vício
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {vices.map((vice) => (
              <ViceCard key={vice.id} vice={vice} onEdit={handleEdit} onDelete={deleteVice} onRelapse={handleRelapse} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
