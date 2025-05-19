'use client'

import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@auth/components/AuthRedirect'

import { useAuth } from '../hooks/useAuth'

export default function AuthGuard({ children }: ChildrenType) {
  const { isAuthenticated, loading } = useAuth()

  if (!isAuthenticated && !loading) {
    return <AuthRedirect />
  }

  return <>{children}</>
}
