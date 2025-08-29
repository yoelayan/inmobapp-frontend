'use client'
import type { ReactNode } from 'react'
import React, { useEffect, createContext, useState, useCallback, useContext } from 'react'

import { useRouter } from 'next/navigation'

import AuthService from '@auth/services/authService'
import type { Session, IProfile } from '@auth/types/UserTypes'

interface AuthContextType {
  session: Session | null
  user: IProfile | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<IProfile | null>(null)
  const router = useRouter()

  const login = async (email: string, password: string) => {
    const sessionData = await AuthService.login(email, password)

    localStorage.setItem('session', JSON.stringify(sessionData))

    if (sessionData?.access) {
      const userData = await AuthService.me()

      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)

    setSession(sessionData)
    }


  }

  const logout = useCallback(async () => {
    localStorage.removeItem('session')
    localStorage.removeItem('user')
    setSession(null)
    router.push('/login')
  }, [router])

  useEffect(() => {
    const session = localStorage.getItem('session')
    const user = localStorage.getItem('user')

    if (user) {
      setUser(JSON.parse(user))
    }

    if (session) {
      const parsedSession = JSON.parse(session)

      console.log('parsedSession', parsedSession)

      if (!isAccessTokenExpired(parsedSession.expires_in)) {
        setSession(parsedSession)
      } else {
        logout()
      }
    }

    setLoading(false)
  }, [logout])

  const isAccessTokenExpired = (accessTokenExpiresTimestamp: number) => {
    const currentTime = Math.floor(Date.now() / 1000)

    return accessTokenExpiresTimestamp < currentTime
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        loading,
        isAuthenticated: !!session,
        user: user || null
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
