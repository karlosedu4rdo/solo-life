import { NextRequest, NextResponse } from 'next/server'
import { UserOperations } from '@/lib/kv-database'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import type { AuthUser } from '@/lib/types'

// GET /api/auth/me - Get current user
export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 }
      )
    }
    
    // Verify token
    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      )
    }
    
    // Get user from database
    const user = await UserOperations.loadUser(authUser.id)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    
    const response = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error getting user:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/auth/me - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 }
      )
    }
    
    // Verify token
    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      )
    }
    
    // Get user from database
    const user = await UserOperations.loadUser(authUser.id)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    
    // Get update data
    const updates = await request.json()
    
    // Validate updates
    if (updates.name && updates.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      )
    }
    
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      )
    }
    
    // Check if email is already taken by another user
    if (updates.email && updates.email !== user.email) {
      const existingUser = await UserOperations.findUserByEmail(updates.email)
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { success: false, message: 'Email já está em uso' },
          { status: 409 }
        )
      }
    }
    
    // Update user
    const updatedUser = {
      ...user,
      name: updates.name?.trim() || user.name,
      email: updates.email?.toLowerCase().trim() || user.email,
      avatar: updates.avatar || user.avatar
    }
    
    // Save updated user
    await UserOperations.saveUser(updatedUser)
    
    // Update email index if email changed
    if (updates.email && updates.email !== user.email) {
      await UserOperations.saveUserEmailIndex(updates.email, user.id)
      // Remove old email index
      await UserOperations.saveUserEmailIndex(user.email, '')
    }
    
    const response = {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt,
        lastLoginAt: updatedUser.lastLoginAt
      },
      message: 'Perfil atualizado com sucesso'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API] Error updating user:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
