import { useContext } from 'react'

import { AuthContext } from '@auth/context/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    // During SSR/SSG or build process, return a default state instead of throwing
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
      return {
        session: null,
        user: null,
        login: async () => {},
        logout: async () => {},
        loading: true,
        isAuthenticated: false
      }
    }
    throw new Error('useAuth solo puede ser usado dentro de un AuthProvider')
  }

  return context
}
