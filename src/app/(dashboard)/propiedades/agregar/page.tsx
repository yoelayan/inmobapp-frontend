'use client'

// React Imports
import React from 'react'
import { useRouter } from 'next/navigation'

// Component Imports
import PropertyForm from '@/pages/apps/properties/form/PropertyForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Types
import type { CreatePropertyFormData } from '@/validations/propertySchema'

// Tipo para la respuesta del backend que incluye el ID
type CreatedProperty = CreatePropertyFormData & { id?: number }

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
      // Fallback: redirigir a la lista de propiedades
      router.push('/propiedades')
    }
  }

  return (
    <>
      <BreadcrumbWrapper />
      <PropertyForm
        mode='create'
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default PropertyAdd
