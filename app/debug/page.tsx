"use client"

import { DebugStorage } from '@/components/debug/debug-storage'

export default function DebugPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Storage</h1>
      <DebugStorage />
    </div>
  )
}
