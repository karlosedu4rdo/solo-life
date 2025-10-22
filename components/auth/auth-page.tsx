"use client"

import { useState } from 'react'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Gamepad2 } from 'lucide-react'

interface AuthPageProps {
  onAuthSuccess?: () => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)

  const handleAuthSuccess = () => {
    onAuthSuccess?.()
  }

  const switchToLogin = () => setIsLogin(true)
  const switchToRegister = () => setIsLogin(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Gamepad2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Solo Life
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Transforme sua vida em uma jornada épica
          </p>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}

        {/* Features */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
              O que você ganha:
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Sistema de gamificação completo</li>
              <li>• Acompanhamento de hábitos</li>
              <li>• Controle financeiro</li>
              <li>• Metas e conquistas</li>
              <li>• Dados seguros e privados</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
