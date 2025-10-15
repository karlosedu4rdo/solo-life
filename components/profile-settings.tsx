"use client"

import { useState } from "react"
import { usePlayer } from "@/hooks/use-player"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Save, X } from "lucide-react"
import { BackupManager } from "@/components/backup-manager"

interface ProfileSettingsProps {
  onClose: () => void
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const { player, updateProfile } = usePlayer()
  const [name, setName] = useState(player?.name || "")
  const [avatar, setAvatar] = useState(player?.avatar || "")
  const [bio, setBio] = useState(player?.bio || "")

  const handleSave = () => {
    updateProfile({ name, avatar, bio })
    onClose()
  }

  const avatarEmojis = ["⚔️", "🛡️", "🏹", "🔮", "⚡", "🔥", "💎", "🌟", "👤", "🎭"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md space-y-6 p-6 my-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Configurações de Perfil</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </div>

          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex flex-wrap gap-2">
              {avatarEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl transition-colors ${
                    avatar === emoji ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Ou insira um emoji/URL personalizado"
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancelar
          </Button>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold mb-4">Sincronização de Dados</h3>
          <BackupManager />
        </div>
      </Card>
    </div>
  )
}
