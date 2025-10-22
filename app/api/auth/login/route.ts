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
    const credentials: LoginCredentials = await request.json()
    
    // Validate credentials
    const validation = validateLoginCredentials(credentials)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      )
    }
    
    // Find user by email
    const user = await UserOperations.findUserByEmail(credentials.email)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Conta desativada' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }
    
    // Generate token
    const authUser = userToAuthUser(user)
    const token = generateToken(authUser)
    
    // Update last login
    const updatedUser = updateLastLogin(user)
    await UserOperations.saveUser(updatedUser)
    
    const response: AuthResponse = {
      success: true,
      user: authUser,
      token,
      message: 'Login realizado com sucesso'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error logging in user:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
