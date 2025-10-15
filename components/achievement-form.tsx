"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import type { SubTask } from "@/lib/types"

interface AchievementFormProps {
  onSubmit: (achievement: {
    name: string
    description: string
    category: string
    subTasks: Omit<SubTask, "id" | "completed">[]
    totalXPReward: number
    titleReward?: string
  }) => void
  onCancel: () => void
}

export function AchievementForm({ onSubmit, onCancel }: AchievementFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [titleReward, setTitleReward] = useState("")
  const [subTasks, setSubTasks] = useState<Array<{ name: string; xpReward: number }>>([{ name: "", xpReward: 50 }])

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { name: "", xpReward: 50 }])
  }

  const handleRemoveSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index))
  }

  const handleSubTaskChange = (index: number, field: "name" | "xpReward", value: string | number) => {
    const updated = [...subTasks]
    updated[index] = { ...updated[index], [field]: value }
    setSubTasks(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const totalXP = subTasks.reduce((sum, task) => sum + task.xpReward, 0)

    onSubmit({
      name,
      description,
      category: category || "Geral",
      subTasks: subTasks.filter((t) => t.name.trim()),
      totalXPReward: totalXP,
      titleReward: titleReward || undefined,
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Conquista</Label>
          <Input
            id="name"
            placeholder="Ex: Aprender Espanhol"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Objetivo da conquista..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              placeholder="Ex: Idiomas"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título Recompensa (opcional)</Label>
            <Input
              id="title"
              placeholder="Ex: Linguista Iniciante"
              value={titleReward}
              onChange={(e) => setTitleReward(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Sub-missões</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSubTask}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            {subTasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nome da sub-missão"
                  value={task.name}
                  onChange={(e) => handleSubTaskChange(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="XP"
                  value={task.xpReward}
                  onChange={(e) => handleSubTaskChange(index, "xpReward", Number.parseInt(e.target.value))}
                  className="w-24"
                  min="10"
                />
                {subTasks.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSubTask(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            XP Total: {subTasks.reduce((sum, task) => sum + task.xpReward, 0)}
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={subTasks.filter((t) => t.name.trim()).length === 0}>
            Criar Conquista
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
