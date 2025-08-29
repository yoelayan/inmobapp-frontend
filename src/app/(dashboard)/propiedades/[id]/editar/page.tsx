'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'

// Component Imports
import PropertyForm from '@/pages/apps/properties/form/PropertyForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

import type { EditPropertyFormData } from '@/validations/propertySchema'

type EditPropertyProps = {
  params: Promise<{
    id: string
  }>
}

const EditProperty: React.FC<EditPropertyProps> = ({ params }) => {
  const router = useRouter()

  const handleSuccess = (data: EditPropertyFormData) => {
    console.log('Propiedad actualizada:', data)
    router.push(`/propiedades/`)
  }

  const { id } = React.use(params)
  const propertyId = Number(id)

  return (
    <PermissionGuard requiredPermissions={['change_realproperty']}>
      <BreadcrumbWrapper />
      <PropertyForm
        propertyId={propertyId}
        mode='edit'
        onSuccess={handleSuccess}
      />
    </PermissionGuard>
  )
}

export default EditProperty
