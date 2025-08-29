'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'

// Component Imports
import PropertyForm from '@/pages/apps/properties/form/PropertyForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'


const PropertyAdd: React.FC = () => {
  const router = useRouter()

  const handleSuccess = (property: any) => {
    console.log('🎉 Propiedad creada exitosamente:', property)
    console.log('🔍 ID de la propiedad:', property.id)
    console.log('🚀 Iniciando redirección...')

    // Redirigir al formulario de edición de la propiedad recién creada
    if (property.id) {
      console.log(`📍 Redirigiendo a: /propiedades/${property.id}/editar`)
      router.push(`/propiedades/${property.id}/editar`)
    } else {
      console.log('⚠️ No se encontró ID, redirigiendo a lista de propiedades')
      router.push('/propiedades')
    }
  }

  return (
    <PermissionGuard requiredPermissions={['add_realproperty']}>
      <BreadcrumbWrapper />
      <PropertyForm
        mode='create'
        onSuccess={handleSuccess}
      />
    </PermissionGuard>
  )
}

export default PropertyAdd
