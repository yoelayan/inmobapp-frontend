import { useContext } from 'react'

import { AuthContext } from '@auth/context/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth solo puede ser usado dentro de un AuthProvider')
  }

  return context
}
