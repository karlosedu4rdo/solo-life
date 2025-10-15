"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Cloud, Download, Upload, FileDown, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCloudBackup } from "@/hooks/use-cloud-backup"

export function BackupManager() {
  const { createBackup, restoreBackup, exportData, importData, isUploading, isDownloading } = useCloudBackup()
  const [backupUrl, setBackupUrl] = useState("")
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null)

  useEffect(() => {
    const lastTime = localStorage.getItem("solo-life-last-backup-time")
    const lastUrl = localStorage.getItem("solo-life-last-backup-url")
    if (lastTime) {
      setLastBackupTime(lastTime)
    }
    if (lastUrl) {
      setBackupUrl(lastUrl)
    }
  }, [])

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      importData(file)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card/50 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Backup na Nuvem</h3>
          </div>

          {lastBackupTime && (
            <p className="text-sm text-muted-foreground">
              Último backup: {new Date(lastBackupTime).toLocaleString("pt-BR")}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={createBackup} disabled={isUploading} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Salvando..." : "Salvar na Nuvem"}
            </Button>
          </div>

          {backupUrl && (
            <div className="space-y-2">
              <Label htmlFor="backup-url" className="text-sm">
                URL do Backup (copie para usar em outro dispositivo)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="backup-url"
                  value={backupUrl}
                  readOnly
                  className="font-mono text-xs"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(backupUrl)
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="restore-url" className="text-sm">
              Restaurar de URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="restore-url"
                placeholder="Cole a URL do backup aqui"
                value={backupUrl}
                onChange={(e) => setBackupUrl(e.target.value)}
                className="font-mono text-xs"
              />
              <Button size="sm" onClick={() => restoreBackup(backupUrl)} disabled={!backupUrl || isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Restaurando..." : "Restaurar"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Export/Import Local</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={exportData} variant="outline" className="flex-1 bg-transparent">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>

            <Label htmlFor="file-import" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <span>
                  <FileUp className="h-4 w-4 mr-2" />
                  Importar Dados
                </span>
              </Button>
              <Input id="file-import" type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </Label>
          </div>

          <p className="text-xs text-muted-foreground">
            Use export/import para fazer backup manual dos seus dados em arquivo JSON.
          </p>
        </div>
      </Card>
    </div>
  )
}
