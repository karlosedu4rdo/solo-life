import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Fetch the backup from Vercel Blob
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch backup")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Backup download error:", error)
    return NextResponse.json({ error: "Backup download failed" }, { status: 500 })
  }
}
