'use client'

// React Imports
import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

// Auth Imports
import { useAuth } from '@auth/hooks/useAuth'

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

const RootPageContent = () => {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to home
        router.replace('/home')
      } else {
        // User is not authenticated, redirect to login
        router.replace('/login')
      }
    }
  }, [user, loading, router])

  // Show loading while determining authentication status
  return <LoadingSpinner />
}

const RootPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RootPageContent />
    </Suspense>
  )
}

export default RootPage
