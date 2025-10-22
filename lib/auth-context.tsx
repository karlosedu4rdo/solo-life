"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AuthUser, LoginCredentials, RegisterCredentials, AuthResponse, AuthContextType } from '@/lib/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (!token) {
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.user)
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('auth-token')
          }
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('auth-token')
        }
      } catch (error) {
        console.error('[AuthProvider] Error loading user:', error)
        localStorage.removeItem('auth-token')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('auth-token', data.token)
        setUser(data.user)
      }

      return data
    } catch (error) {
      console.error('[AuthProvider] Login error:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.'
      }
    }
  }, [])

  // Register function
  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('auth-token', data.token)
        setUser(data.user)
      }

      return data
    } catch (error) {
      console.error('[AuthProvider] Register error:', error)
      return {
        success: false,
        message: 'Erro de conexão. Tente novamente.'
      }
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('auth-token')
    setUser(null)
  }, [])

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<AuthUser>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return false

      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        return true
      }

      return false
    } catch (error) {
      console.error('[AuthProvider] Update profile error:', error)
      return false
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to get auth token
export function useAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth-token')
}

// Hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  const { user, isLoading } = useAuth()
  return !isLoading && user !== null
}
