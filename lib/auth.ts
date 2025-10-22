import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, AuthUser, LoginCredentials, RegisterCredentials, AuthResponse } from './types'

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'solo-life-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.avatar
    }
  } catch (error) {
    console.error('[Auth] Token verification failed:', error)
    return null
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Senha deve ter pelo menos 6 caracteres' }
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Senha deve ter no máximo 128 caracteres' }
  }
  
  return { valid: true }
}

// Validate name
export function isValidName(name: string): { valid: boolean; message?: string } {
  if (name.length < 2) {
    return { valid: false, message: 'Nome deve ter pelo menos 2 caracteres' }
  }
  
  if (name.length > 50) {
    return { valid: false, message: 'Nome deve ter no máximo 50 caracteres' }
  }
  
  return { valid: true }
}

// Create user object
export function createUser(credentials: RegisterCredentials, passwordHash: string): User {
  return {
    id: generateId(),
    email: credentials.email.toLowerCase().trim(),
    name: credentials.name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
    isActive: true
  }
}

// Generate unique ID
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

// Convert User to AuthUser
export function userToAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar
  }
}

// Validate login credentials
export function validateLoginCredentials(credentials: LoginCredentials): { valid: boolean; message?: string } {
  if (!credentials.email || !credentials.password) {
    return { valid: false, message: 'Email e senha são obrigatórios' }
  }
  
  if (!isValidEmail(credentials.email)) {
    return { valid: false, message: 'Email inválido' }
  }
  
  return { valid: true }
}

// Validate register credentials
export function validateRegisterCredentials(credentials: RegisterCredentials): { valid: boolean; message?: string } {
  if (!credentials.name || !credentials.email || !credentials.password) {
    return { valid: false, message: 'Nome, email e senha são obrigatórios' }
  }
  
  const nameValidation = isValidName(credentials.name)
  if (!nameValidation.valid) {
    return nameValidation
  }
  
  if (!isValidEmail(credentials.email)) {
    return { valid: false, message: 'Email inválido' }
  }
  
  const passwordValidation = isValidPassword(credentials.password)
  if (!passwordValidation.valid) {
    return passwordValidation
  }
  
  return { valid: true }
}

// Generate avatar URL from name
export function generateAvatarUrl(name: string): string {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=ffffff&size=128`
}

// Update user last login
export function updateLastLogin(user: User): User {
  return {
    ...user,
    lastLoginAt: new Date().toISOString()
  }
}
