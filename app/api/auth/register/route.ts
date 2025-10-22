import { NextRequest, NextResponse } from 'next/server'
import { UserOperations } from '@/lib/kv-database'
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  createUser, 
  userToAuthUser,
  validateLoginCredentials,
  validateRegisterCredentials,
  generateAvatarUrl,
  updateLastLogin
} from '@/lib/auth'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/lib/types'

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const credentials: RegisterCredentials = await request.json()
    
    // Validate credentials
    const validation = validateRegisterCredentials(credentials)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await UserOperations.findUserByEmail(credentials.email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Usuário já existe com este email' },
        { status: 409 }
      )
    }
    
    // Hash password
    const passwordHash = await hashPassword(credentials.password)
    
    // Create user
    const user = createUser(credentials, passwordHash)
    user.avatar = generateAvatarUrl(user.name)
    
    // Save user
    await UserOperations.saveUser(user)
    await UserOperations.saveUserEmailIndex(user.email, user.id)
    
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
      message: 'Usuário criado com sucesso'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error registering user:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
