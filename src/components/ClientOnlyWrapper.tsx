'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface ClientOnlyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

const ClientOnlyWrapper = ({ children, fallback = null }: ClientOnlyWrapperProps) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default ClientOnlyWrapper
