'use client'

// React Imports
import React from 'react'

// Component Imports
import { FranchiseForm } from '@/pages/apps/franchises/form/FranchiseForm'
import SectionHeader from '@/components/layout/horizontal/SectionHeader'

const AddFranchise: React.FC = () => {
  return (
    <>
      <SectionHeader title='Agregar Franquicia' subtitle='Crear una nueva franquicia en el sistema' />
      <FranchiseForm />
    </>
  )
}

export default AddFranchise
