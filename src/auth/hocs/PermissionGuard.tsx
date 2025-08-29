'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { useAuth } from '@auth/hooks/useAuth'

interface PermissionGuardProps {
  children: ReactNode
  requiredPermissions: string | string[]
  fallbackPath?: string
  requireAll?: boolean // Si true, requiere TODOS los permisos. Si false, requiere AL MENOS UNO
}

export default function PermissionGuard({
  children,
  requiredPermissions,
  fallbackPath = '/unauthorized',
  requireAll = false
}: PermissionGuardProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (loading) return

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${pathname}`)

      return
    }

    // Si no hay usuario o permisos, redirigir
    if (!user || !user.user_permissions) {
      router.push(fallbackPath)

      return
    }

    // Normalizar permisos requeridos a array
    const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

    // Verificar permisos
    const hasRequiredPermissions = requireAll
      ? permissionsArray.every(permission => user.user_permissions.includes(permission))
      : permissionsArray.some(permission => user.user_permissions.includes(permission))

    // Si no tiene permisos, redirigir
    if (!hasRequiredPermissions) {
      router.push(fallbackPath)
    }
  }, [user, isAuthenticated, loading, requiredPermissions, requireAll, fallbackPath, router, pathname])

  // Mostrar loading mientras se verifica
  if (loading) {
    return <div>Cargando...</div> // Puedes personalizar esto con tu componente de loading
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated || !user) {
    return null
  }

  // Verificar permisos antes de renderizar
  const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

  const hasRequiredPermissions = requireAll
    ? permissionsArray.every(permission => user.user_permissions.includes(permission))
    : permissionsArray.some(permission => user.user_permissions.includes(permission))

  if (!hasRequiredPermissions) {
    return null // Se redirigirá en el useEffect
  }

  return <>{children}</>
}
