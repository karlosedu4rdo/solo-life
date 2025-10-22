import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/database'

// POST /api/database/backup - Create a backup
export async function POST(request: NextRequest) {
  try {
    const backupFilename = await DatabaseOperations.createBackup()
    return NextResponse.json({ 
      success: true, 
      backupFilename,
      message: 'Backup created successfully' 
    })
  } catch (error) {
    console.error('[API] Error creating backup:', error)
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}

// POST /api/database/restore - Restore from backup
export async function PUT(request: NextRequest) {
  try {
    const { backupFilename } = await request.json()
    
    if (!backupFilename) {
      return NextResponse.json(
        { error: 'Backup filename is required' },
        { status: 400 }
      )
    }
    
    await DatabaseOperations.restoreFromBackup(backupFilename)
    return NextResponse.json({ 
      success: true,
      message: 'Data restored successfully' 
    })
  } catch (error) {
    console.error('[API] Error restoring backup:', error)
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    )
  }
}
