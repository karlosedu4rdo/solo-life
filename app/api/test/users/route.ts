import { NextRequest, NextResponse } from 'next/server'
import { UserOperations } from '@/lib/kv-database'

// GET /api/test/users - List all users (debug only)
export async function GET(request: NextRequest) {
  try {
    console.log('[API] List users request received')
    
    // This is a simplified version - in production you'd want proper user management
    const testUsers = [
      {
        id: 'test-user-1',
        email: 'test1@example.com',
        name: 'Test User 1'
      },
      {
        id: 'test-user-2', 
        email: 'test2@example.com',
        name: 'Test User 2'
      }
    ]
    
    const response = {
      success: true,
      message: 'Users listed',
      users: testUsers,
      note: 'This is a debug endpoint - implement proper user listing in production'
    }
    
    console.log('[API] Users listed:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] List users failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to list users',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
