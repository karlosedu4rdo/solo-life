import { NextRequest, NextResponse } from 'next/server'
import { KVOperations } from '@/lib/kv-database'

// GET /api/data/[entity] - Load data for a specific entity
export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  try {
    const { entity } = params
    
    let data: any = null
    
    switch (entity) {
      case 'player':
        data = await KVOperations.loadPlayer()
        break
      case 'habits':
        data = await KVOperations.loadHabits()
        break
      case 'transactions':
        data = await KVOperations.loadTransactions()
        break
      case 'financial-goals':
        data = await KVOperations.loadFinancialGoals()
        break
      case 'investments':
        data = await KVOperations.loadInvestments()
        break
      case 'achievements':
        data = await KVOperations.loadAchievements()
        break
      case 'notifications':
        data = await KVOperations.loadNotifications()
        break
      case 'culture-items':
        data = await KVOperations.loadCultureItems()
        break
      case 'vices':
        data = await KVOperations.loadVices()
        break
      case 'workout-sessions':
        data = await KVOperations.loadWorkoutSessions()
        break
      case 'workout-logs':
        data = await KVOperations.loadWorkoutLogs()
        break
      default:
        return NextResponse.json(
          { error: `Unknown entity: ${entity}` },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error(`[API] Error loading ${params.entity}:`, error)
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    )
  }
}

// POST /api/data/[entity] - Save data for a specific entity
export async function POST(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  try {
    const { entity } = params
    const body = await request.json()
    
    switch (entity) {
      case 'player':
        await KVOperations.savePlayer(body)
        break
      case 'habits':
        await KVOperations.saveHabits(body)
        break
      case 'transactions':
        await KVOperations.saveTransactions(body)
        break
      case 'financial-goals':
        await KVOperations.saveFinancialGoals(body)
        break
      case 'investments':
        await KVOperations.saveInvestments(body)
        break
      case 'achievements':
        await KVOperations.saveAchievements(body)
        break
      case 'notifications':
        await KVOperations.saveNotifications(body)
        break
      case 'culture-items':
        await KVOperations.saveCultureItems(body)
        break
      case 'vices':
        await KVOperations.saveVices(body)
        break
      case 'workout-sessions':
        await KVOperations.saveWorkoutSessions(body)
        break
      case 'workout-logs':
        await KVOperations.saveWorkoutLogs(body)
        break
      default:
        return NextResponse.json(
          { error: `Unknown entity: ${entity}` },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[API] Error saving ${params.entity}:`, error)
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    )
  }
}
