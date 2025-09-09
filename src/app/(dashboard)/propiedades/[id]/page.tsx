'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import PropertyProfile from '@/pages/apps/properties/detail/PropertyProfile'

const PropertyDetailPage = () => {
  const params = useParams()
  const propertyId = params?.id as string

  if (!propertyId) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>ID de propiedad no válido</p>
      </div>
    )
  }

  return <PropertyProfile propertyId={propertyId} />
}

export default PropertyDetailPage
