'use client'

// React Imports
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// Component Imports
import PropertyForm from '@/pages/apps/properties/form/PropertyForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'
import PropertiesRepository from '@/services/repositories/realstate/PropertiesRepository'

import type { EditPropertyFormData } from '@/validations/propertySchema'
import type { IProfile } from '@/auth/types/UserTypes'

type EditPropertyProps = {
  params: Promise<{
    id: string
  }>
}

const EditProperty: React.FC<EditPropertyProps> = ({ params }) => {
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { id } = React.use(params)
  const propertyId = Number(id)

  // Fetch property to check ownership
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await PropertiesRepository.get(propertyId)

        setProperty(propertyData)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const handleSuccess = (data: EditPropertyFormData) => {
    console.log('Propiedad actualizada:', data)
    router.push(`/propiedades/`)
  }

  // Custom permission logic: verify ownership
  const canAccess = (user: IProfile) => {
    if (!user || !property) return false

    // Si es superusuario, permitir siempre (ya se verifica en PermissionGuard, pero por si acaso)
    if (user.is_superuser) return true

    // Verificar si el usuario es el dueño asignado
    return property.assigned_to_id === user.id
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <PermissionGuard requiredPermissions={['change_realproperty']} conditionToAccess={canAccess}>
      <BreadcrumbWrapper />
      <PropertyForm propertyId={propertyId} mode='edit' onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default EditProperty
