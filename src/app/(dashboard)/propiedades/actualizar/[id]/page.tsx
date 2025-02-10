'use client'

// React Imports
import React from 'react'

// Component Imports
import { PropertyForm } from '@/views/apps/properties/form/PropertyForm'

const PropertyAdd = ({ params }: { params: { id: string } }) => {

  return <PropertyForm id={params.id} />
}

export default PropertyAdd
