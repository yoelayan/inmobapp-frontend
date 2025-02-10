'use client'
import type { ReactNode } from 'react';
import React, { useEffect, createContext, useState } from 'react'

import { useRouter } from 'next/navigation'

import AuthService from '@auth/services/authService'
import type { User } from '@auth/types/UsuarioTypes'

interface AuthContextType {
  session: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  // states constains the loading and isAuthenticated states
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('session')
    
    if (session) {
      const parsedUser = JSON.parse(session)
      console.log(parsedUser)

      if (!isAccessTokenExpired(parsedUser.access_token_expires)) {
        
        setSession(parsedUser)
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
    const userData = await AuthService.login(email, password)

    localStorage.setItem('session', JSON.stringify(userData))
    setSession(userData)
  }

  const logout = async () => {
    localStorage.removeItem('session')
    setSession(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ 
      session, login, logout,
      loading, isAuthenticated: !!session
    }}>
    {children}
  </AuthContext.Provider>
}

export { AuthContext }
