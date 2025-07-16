// contexts/AuthContext.tsx
'use client'

import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Admin email listesi (gerçek uygulamada veritabanında tutulmalı)
  const adminEmails = [
    'admin@example.com', // Test hesabı
    'murat.sag@hotmail.com' // Sizin hesabınız
  ]

  const isAdmin = user ? adminEmails.includes(user.email || '') : false

  // Hydration error'u önlemek için
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Mevcut kullanıcı oturumunu kontrol et
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Auth error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)

        if (event === 'SIGNED_IN' && mounted) {
          router.push('/admin/dashboard')
        }
        
        if (event === 'SIGNED_OUT' && mounted) {
          router.push('/admin/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, mounted])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Admin kontrolü
      if (!adminEmails.includes(email)) {
        await supabase.auth.signOut()
        throw new Error('Bu hesap admin yetkisine sahip değil')
      }

      setUser(data.user)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin
  }

  // Hydration error'u önlemek için
  if (!mounted) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// HOC for protecting admin routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAdmin } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && (!user || !isAdmin)) {
        router.push('/admin/login')
      }
    }, [user, loading, isAdmin, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user || !isAdmin) {
      return null
    }

    return <Component {...props} />
  }
}