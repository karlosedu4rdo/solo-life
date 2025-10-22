import { NextRequest, NextResponse } from 'next/server'
import { UserOperations } from '@/lib/kv-database'
import { 
  verifyPassword, 
  generateToken, 
  userToAuthUser,
  validateLoginCredentials,
  updateLastLogin
} from '@/lib/auth'
import type { LoginCredentials, AuthResponse } from '@/lib/types'

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    console.log('[API] Login request received')
    
    const credentials: LoginCredentials = await request.json()
    console.log('[API] Login credentials received:', { email: credentials.email })
    
    // Validate credentials
    const validation = validateLoginCredentials(credentials)
    if (!validation.valid) {
      console.log('[API] Login validation failed:', validation.message)
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      )
    }
    
    console.log('[API] Login credentials validated successfully')
    
    // Find user by email
    const user = await UserOperations.findUserByEmail(credentials.email)
    if (!user) {
      console.log('[API] User not found:', credentials.email)
      return NextResponse.json(
        { success: false, message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }
    
    console.log('[API] User found:', { id: user.id, email: user.email, name: user.name })
    
    // Check if user is active
    if (!user.isActive) {
      console.log('[API] User account is inactive:', user.email)
      return NextResponse.json(
        { success: false, message: 'Conta desativada' },
        { status: 401 }
      )
    }
    
    console.log('[API] User account is active, verifying password')
    
    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, user.passwordHash)
    console.log('[API] Password verification result:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('[API] Invalid password for user:', user.email)
      return NextResponse.json(
        { success: false, message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }
    
    console.log('[API] Password verified successfully')
    
    // Generate token
    const authUser = userToAuthUser(user)
    const token = generateToken(authUser)
    console.log('[API] Token generated successfully')
    
    // Update last login
    const updatedUser = updateLastLogin(user)
    await UserOperations.saveUser(updatedUser)
    console.log('[API] Last login updated')
    
    const response: AuthResponse = {
      success: true,
      user: authUser,
      token,
      message: 'Login realizado com sucesso'
    }
    
    console.log('[API] Login successful for user:', user.email)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error logging in user:', error)
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
