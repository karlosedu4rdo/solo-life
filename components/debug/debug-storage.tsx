"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DebugStorage() {
  const [storageData, setStorageData] = useState<Record<string, any>>({})

  const loadStorageData = () => {
    if (typeof window === 'undefined') return

    const data: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('solo-life:')) {
        try {
          const value = localStorage.getItem(key)
          if (value) {
            data[key] = JSON.parse(value)
          }
        } catch (error) {
          data[key] = value
        }
      }
    }
    setStorageData(data)
  }

  useEffect(() => {
    loadStorageData()
  }, [])

  const clearStorage = () => {
    if (typeof window === 'undefined') return

    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('solo-life:')) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key))
    loadStorageData()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Debug Storage</CardTitle>
        <div className="flex gap-2">
          <Button onClick={loadStorageData} variant="outline">
            Recarregar
          </Button>
          <Button onClick={clearStorage} variant="destructive">
            Limpar Storage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(storageData).length === 0 ? (
            <p className="text-muted-foreground">Nenhum dado encontrado no localStorage</p>
          ) : (
            Object.entries(storageData).map(([key, value]) => (
              <div key={key} className="border rounded p-4">
                <h3 className="font-semibold text-sm mb-2">{key}</h3>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
