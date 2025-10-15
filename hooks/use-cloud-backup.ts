"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export interface BackupData {
  userId: string
  timestamp: string
  player: any
  habits: any[]
  transactions: any[]
  financialGoals: any[]
  achievements: any[]
  cultureItems: any[]
  vices: any[]
  workoutSessions: any[]
}

export function useCloudBackup() {
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [lastBackupUrl, setLastBackupUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const createBackup = useCallback(async () => {
    setIsUploading(true)
    try {
      // Gather all data from localStorage
      const backupData: BackupData = {
        userId: localStorage.getItem("solo-life-user-id") || `user-${Date.now()}`,
        timestamp: new Date().toISOString(),
        player: JSON.parse(localStorage.getItem("solo-life-player") || "null"),
        habits: JSON.parse(localStorage.getItem("solo-life-habits") || "[]"),
        transactions: JSON.parse(localStorage.getItem("solo-life-transactions") || "[]"),
        financialGoals: JSON.parse(localStorage.getItem("solo-life-financial-goals") || "[]"),
        achievements: JSON.parse(localStorage.getItem("solo-life-achievements") || "[]"),
        cultureItems: JSON.parse(localStorage.getItem("solo-life-culture-items") || "[]"),
        vices: JSON.parse(localStorage.getItem("solo-life-vices") || "[]"),
        workoutSessions: JSON.parse(localStorage.getItem("solo-life-workout-sessions") || "[]"),
      }

      // Save user ID if not exists
      if (!localStorage.getItem("solo-life-user-id")) {
        localStorage.setItem("solo-life-user-id", backupData.userId)
      }

      const response = await fetch("/api/backup/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData),
      })

      if (!response.ok) {
        throw new Error("Backup upload failed")
      }

      const result = await response.json()
      setLastBackupUrl(result.url)

      // Save backup URL to localStorage
      localStorage.setItem("solo-life-last-backup-url", result.url)
      localStorage.setItem("solo-life-last-backup-time", result.timestamp)

      toast({
        title: "Backup criado com sucesso!",
        description: "Seus dados foram salvos na nuvem.",
      })

      return result.url
    } catch (error) {
      console.error("Backup error:", error)
      toast({
        title: "Erro ao criar backup",
        description: "Não foi possível salvar seus dados na nuvem.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [toast])

  const restoreBackup = useCallback(
    async (url: string) => {
      setIsDownloading(true)
      try {
        const response = await fetch(`/api/backup/download?url=${encodeURIComponent(url)}`)

        if (!response.ok) {
          throw new Error("Backup download failed")
        }

        const backupData: BackupData = await response.json()

        // Restore all data to localStorage
        if (backupData.player) {
          localStorage.setItem("solo-life-player", JSON.stringify(backupData.player))
        }
        if (backupData.habits) {
          localStorage.setItem("solo-life-habits", JSON.stringify(backupData.habits))
        }
        if (backupData.transactions) {
          localStorage.setItem("solo-life-transactions", JSON.stringify(backupData.transactions))
        }
        if (backupData.financialGoals) {
          localStorage.setItem("solo-life-financial-goals", JSON.stringify(backupData.financialGoals))
        }
        if (backupData.achievements) {
          localStorage.setItem("solo-life-achievements", JSON.stringify(backupData.achievements))
        }
        if (backupData.cultureItems) {
          localStorage.setItem("solo-life-culture-items", JSON.stringify(backupData.cultureItems))
        }
        if (backupData.vices) {
          localStorage.setItem("solo-life-vices", JSON.stringify(backupData.vices))
        }
        if (backupData.workoutSessions) {
          localStorage.setItem("solo-life-workout-sessions", JSON.stringify(backupData.workoutSessions))
        }
        if (backupData.userId) {
          localStorage.setItem("solo-life-user-id", backupData.userId)
        }

        toast({
          title: "Backup restaurado com sucesso!",
          description: "Seus dados foram recuperados. Recarregue a página para ver as mudanças.",
        })

        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (error) {
        console.error("Restore error:", error)
        toast({
          title: "Erro ao restaurar backup",
          description: "Não foi possível recuperar seus dados.",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsDownloading(false)
      }
    },
    [toast],
  )

  const exportData = useCallback(() => {
    try {
      const backupData: BackupData = {
        userId: localStorage.getItem("solo-life-user-id") || `user-${Date.now()}`,
        timestamp: new Date().toISOString(),
        player: JSON.parse(localStorage.getItem("solo-life-player") || "null"),
        habits: JSON.parse(localStorage.getItem("solo-life-habits") || "[]"),
        transactions: JSON.parse(localStorage.getItem("solo-life-transactions") || "[]"),
        financialGoals: JSON.parse(localStorage.getItem("solo-life-financial-goals") || "[]"),
        achievements: JSON.parse(localStorage.getItem("solo-life-achievements") || "[]"),
        cultureItems: JSON.parse(localStorage.getItem("solo-life-culture-items") || "[]"),
        vices: JSON.parse(localStorage.getItem("solo-life-vices") || "[]"),
        workoutSessions: JSON.parse(localStorage.getItem("solo-life-workout-sessions") || "[]"),
      }

      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `solo-life-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Dados exportados!",
        description: "Arquivo de backup baixado com sucesso.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Erro ao exportar dados",
        description: "Não foi possível criar o arquivo de backup.",
        variant: "destructive",
      })
    }
  }, [toast])

  const importData = useCallback(
    (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const backupData: BackupData = JSON.parse(e.target?.result as string)

            // Restore all data to localStorage
            if (backupData.player) {
              localStorage.setItem("solo-life-player", JSON.stringify(backupData.player))
            }
            if (backupData.habits) {
              localStorage.setItem("solo-life-habits", JSON.stringify(backupData.habits))
            }
            if (backupData.transactions) {
              localStorage.setItem("solo-life-transactions", JSON.stringify(backupData.transactions))
            }
            if (backupData.financialGoals) {
              localStorage.setItem("solo-life-financial-goals", JSON.stringify(backupData.financialGoals))
            }
            if (backupData.achievements) {
              localStorage.setItem("solo-life-achievements", JSON.stringify(backupData.achievements))
            }
            if (backupData.cultureItems) {
              localStorage.setItem("solo-life-culture-items", JSON.stringify(backupData.cultureItems))
            }
            if (backupData.vices) {
              localStorage.setItem("solo-life-vices", JSON.stringify(backupData.vices))
            }
            if (backupData.workoutSessions) {
              localStorage.setItem("solo-life-workout-sessions", JSON.stringify(backupData.workoutSessions))
            }
            if (backupData.userId) {
              localStorage.setItem("solo-life-user-id", backupData.userId)
            }

            toast({
              title: "Dados importados com sucesso!",
              description: "Recarregando a página para aplicar as mudanças...",
            })

            setTimeout(() => {
              window.location.reload()
            }, 1500)

            resolve()
          } catch (error) {
            console.error("Import error:", error)
            toast({
              title: "Erro ao importar dados",
              description: "O arquivo fornecido é inválido.",
              variant: "destructive",
            })
            reject(error)
          }
        }

        reader.onerror = () => {
          toast({
            title: "Erro ao ler arquivo",
            description: "Não foi possível ler o arquivo fornecido.",
            variant: "destructive",
          })
          reject(new Error("File read error"))
        }

        reader.readAsText(file)
      })
    },
    [toast],
  )

  return {
    createBackup,
    restoreBackup,
    exportData,
    importData,
    isUploading,
    isDownloading,
    lastBackupUrl,
  }
}
