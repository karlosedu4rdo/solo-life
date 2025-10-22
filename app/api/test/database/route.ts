import { NextRequest, NextResponse } from 'next/server'
import { UserOperations } from '@/lib/kv-database'

// GET /api/test/database - Test database functionality
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Test database request received')
    
    // Test writing data
    const testData = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashed-password',
      createdAt: new Date().toISOString(),
      isActive: true
    }
    
    console.log('[API] Writing test user data')
    await UserOperations.saveUser(testData)
    await UserOperations.saveUserEmailIndex(testData.email, testData.id)
    
    // Test reading data
    console.log('[API] Reading test user data')
    const foundUser = await UserOperations.findUserByEmail(testData.email)
    
    const response = {
      success: true,
      message: 'Database test completed',
      testData: {
        written: testData,
        read: foundUser,
        match: foundUser && foundUser.id === testData.id
      }
    }
    
    console.log('[API] Test completed:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Database test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
