'use client'
import type { ReactNode } from 'react';
import React, { useEffect, createContext, useState } from 'react'

import { useRouter } from 'next/navigation'

import AuthService from '@auth/services/authService'
import type { User, Session } from '@auth/types/UserTypes'

interface AuthContextType {
  session: Session | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  // states constains the loading and isAuthenticated states
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('session')
    
    if (session) {
      const parsedSession = JSON.parse(session)
      console.log(parsedSession)

      if (!isAccessTokenExpired(parsedSession.expires_in)) {
        
        setSession(parsedSession)
      } else {
        logout()
      }
    }
    setLoading(false)
  }, [])

  const isAccessTokenExpired = (accessTokenExpiresTimestamp: number) => {
    
    const currentTime = Math.floor(Date.now() / 1000)
    return accessTokenExpiresTimestamp < currentTime
  }


  const login = async (email: string, password: string) => {
    const sessionData = await AuthService.login(email, password)

    localStorage.setItem('session', JSON.stringify(sessionData))
    setSession(sessionData)
  }

  const logout = async () => {
    localStorage.removeItem('session')
    setSession(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ 
      session, login, logout,
      loading, isAuthenticated: !!session,
      user: session?.user || null
    }}>
    {children}
  </AuthContext.Provider>
}

export { AuthContext }
