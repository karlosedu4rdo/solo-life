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
    console.log('[API] Register request received')
    
    const credentials: RegisterCredentials = await request.json()
    console.log('[API] Credentials received:', { email: credentials.email, name: credentials.name })
    
    // Validate credentials
    const validation = validateRegisterCredentials(credentials)
    if (!validation.valid) {
      console.log('[API] Validation failed:', validation.message)
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      )
    }
    
    console.log('[API] Credentials validated successfully')
    
    // Check if user already exists
    const existingUser = await UserOperations.findUserByEmail(credentials.email)
    if (existingUser) {
      console.log('[API] User already exists:', credentials.email)
      return NextResponse.json(
        { success: false, message: 'Usuário já existe com este email' },
        { status: 409 }
      )
    }
    
    console.log('[API] User does not exist, proceeding with registration')
    
    // Hash password
    const passwordHash = await hashPassword(credentials.password)
    console.log('[API] Password hashed successfully')
    
    // Create user
    const user = createUser(credentials, passwordHash)
    user.avatar = generateAvatarUrl(user.name)
    console.log('[API] User object created:', { id: user.id, email: user.email })
    
    // Save user
    await UserOperations.saveUser(user)
    await UserOperations.saveUserEmailIndex(user.email, user.id)
    console.log('[API] User saved to database')
    
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
      message: 'Usuário criado com sucesso'
    }
    
    console.log('[API] Registration successful for user:', user.email)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error registering user:', error)
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
