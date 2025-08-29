import type { ReactNode } from 'react'

import { useAuth } from '@auth/hooks/useAuth'

interface CanProps {
  permissions: string | string[]
  children: ReactNode
}

/**
 * Componente que renderiza condicionalmente contenido basado en los permisos del usuario
 * @param permissions - Un codename de permiso o array de codenames que el usuario debe tener
 * @param children - El contenido a renderizar si el usuario tiene los permisos
 * @example
 * <Can permissions="view_property">
 *   <PropertyList />
 * </Can>
 *
 * <Can permissions={['view_property', 'edit_property']}>
 *   <PropertyList />
 */
export const Can = ({ permissions, children }: CanProps) => {
  const { user } = useAuth()

  // Si no hay usuario autenticado, no renderizar nada
  if (!user || !user.user_permissions) {
    return null
  }

  // Normalizar permissions a array para facilitar la verificación
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions]

  // Verificar si el usuario tiene al menos uno de los permisos requeridos
  const hasPermission = permissionsArray.some(permission =>
    user.user_permissions.includes(permission)
  )

  // Solo renderizar children si el usuario tiene los permisos necesarios
  return hasPermission ? <>{children}</> : null
}

export default Can
