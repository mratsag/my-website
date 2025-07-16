// app/admin/login/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { formatErrorMessage } from '@/lib/utils'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, user, isAdmin } = useAuth()
  const router = useRouter()

  // Zaten giriş yapmış admin kullanıcıları dashboard'a yönlendir
  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [user, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email.length > 0 && password.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Admin Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Portföy yönetimi için giriş yapın
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <Input
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="pl-10 pr-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {error && (
              <Alert type="error" title="Giriş Hatası">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || loading}
              loading={loading}
            >
              Giriş Yap
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Test hesabı
                </span>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
              <p className="font-medium mb-2">Deneme için kullanabilirsiniz:</p>
              <p className="text-gray-700">Email: admin@example.com</p>
              <p className="text-gray-700">Şifre: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}