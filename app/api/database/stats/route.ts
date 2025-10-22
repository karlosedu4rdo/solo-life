import { NextRequest, NextResponse } from 'next/server'
import { KVOperations } from '@/lib/kv-database'

// GET /api/database/stats - Get database statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await KVOperations.getStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error('[API] Error getting database stats:', error)
    return NextResponse.json(
      { error: 'Failed to get database statistics' },
      { status: 500 }
    )
  }
}
