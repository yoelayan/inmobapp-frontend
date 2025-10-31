'use client'

// React Imports
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import FranchiseForm from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'
import { useAuth } from '@/auth/hooks/useAuth'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'

import type { CreateFranchiseFormData, EditFranchiseFormData } from '@/validations/franchiseSchema'
import type { IProfile } from '@/auth/types/UserTypes'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'

const AddFranchise: React.FC = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [userFranchise, setUserFranchise] = useState<IFranchise | null>(null)
  const [loading, setLoading] = useState(true)

  // Obtener la franquicia del usuario actual directamente del backend
  useEffect(() => {
    const fetchUserFranchise = async () => {
      if (user?.franchise) {
        try {
          // Manejar el caso donde franchise puede ser un objeto o un número
          const franchiseId = typeof user.franchise === 'object' 
            ? (user.franchise as any).id 
            : user.franchise

          if (franchiseId) {
            const franchise = await FranchisesRepository.get(franchiseId)

            setUserFranchise(franchise)
          }
        } catch (error) {
          console.error('Error fetching user franchise:', error)
        }
      }
      
      setLoading(false)
    }
    
    if (user) {
      fetchUserFranchise()
    } else {
      setLoading(false)
    }
  }, [user])

  const handleSuccess = (data: CreateFranchiseFormData | EditFranchiseFormData) => {
    console.log(data)
    router.push(`/franquicias/`)
  }

  // Custom permission logic: verificar que NO sea franquicia PERSONAL
  const canAccess = (user: IProfile) => {
    if (!user) return false

    // Si es superusuario, permitir siempre
    if (user.is_superuser) return true

    // Si no se ha cargado la franquicia aún, no permitir (esperar a que cargue)
    if (!userFranchise) return false

    // Bloquear acceso si el usuario es de franquicia PERSONAL
    return userFranchise.franchise_type !== 'PERSONAL'
  }

  if (loading || !user) {
    return <div>Cargando...</div>
  }

  return (
    <PermissionGuard requiredPermissions={['add_franchise']} conditionToAccess={canAccess}>
      <BreadcrumbWrapper />
      <FranchiseForm onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default AddFranchise
