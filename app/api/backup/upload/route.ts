import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data || !data.userId) {
      return NextResponse.json({ error: "Invalid backup data" }, { status: 400 })
    }

    // Create a JSON blob with the backup data
    const backupJson = JSON.stringify(data, null, 2)
    const blob = new Blob([backupJson], { type: "application/json" })

    // Upload to Vercel Blob with user-specific path
    const result = await put(`backups/${data.userId}/backup-${Date.now()}.json`, blob, {
      access: "public",
    })

    return NextResponse.json({
      url: result.url,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Backup upload error:", error)
    return NextResponse.json({ error: "Backup upload failed" }, { status: 500 })
  }
}
