'use client'

// React Imports
import React from 'react'

// Component Imports
import PropertyForm from '@/pages/apps/properties/form/PropertyForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Hooks Imports

const PropertyAdd: React.FC = () => {

  return (
    <>
      <BreadcrumbWrapper />
      <PropertyForm
        mode='create'
        onSuccess={(property) => {
          console.log('Propiedad creada:', property)
        }}
      />
    </>
  )
}

export default PropertyAdd
