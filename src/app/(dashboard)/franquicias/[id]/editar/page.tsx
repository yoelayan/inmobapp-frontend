'use client'

// React Imports
import React from 'react'

// Component Imports
import { FranchiseForm } from '@/pages/apps/franchises/form/FranchiseForm'
import SectionHeader from '@/components/layout/horizontal/SectionHeader'

interface EditFranchiseProps {
  params: {
    id: string
  }
}

const EditFranchise: React.FC<EditFranchiseProps> = ({ params }) => {
  return (
    <>
      <SectionHeader title='Editar Franquicia' subtitle='Modificar los datos de la franquicia' />
      <FranchiseForm franchiseId={params.id} />
    </>
  )
}

export default EditFranchise
