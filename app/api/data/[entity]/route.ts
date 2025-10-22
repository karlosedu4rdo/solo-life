import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/database'

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
        data = await DatabaseOperations.loadPlayer()
        break
      case 'habits':
        data = await DatabaseOperations.loadHabits()
        break
      case 'transactions':
        data = await DatabaseOperations.loadTransactions()
        break
      case 'financial-goals':
        data = await DatabaseOperations.loadFinancialGoals()
        break
      case 'investments':
        data = await DatabaseOperations.loadInvestments()
        break
      case 'achievements':
        data = await DatabaseOperations.loadAchievements()
        break
      case 'notifications':
        data = await DatabaseOperations.loadNotifications()
        break
      case 'culture-items':
        data = await DatabaseOperations.loadCultureItems()
        break
      case 'vices':
        data = await DatabaseOperations.loadVices()
        break
      case 'workout-sessions':
        data = await DatabaseOperations.loadWorkoutSessions()
        break
      case 'workout-logs':
        data = await DatabaseOperations.loadWorkoutLogs()
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
        await DatabaseOperations.savePlayer(body)
        break
      case 'habits':
        await DatabaseOperations.saveHabits(body)
        break
      case 'transactions':
        await DatabaseOperations.saveTransactions(body)
        break
      case 'financial-goals':
        await DatabaseOperations.saveFinancialGoals(body)
        break
      case 'investments':
        await DatabaseOperations.saveInvestments(body)
        break
      case 'achievements':
        await DatabaseOperations.saveAchievements(body)
        break
      case 'notifications':
        await DatabaseOperations.saveNotifications(body)
        break
      case 'culture-items':
        await DatabaseOperations.saveCultureItems(body)
        break
      case 'vices':
        await DatabaseOperations.saveVices(body)
        break
      case 'workout-sessions':
        await DatabaseOperations.saveWorkoutSessions(body)
        break
      case 'workout-logs':
        await DatabaseOperations.saveWorkoutLogs(body)
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
