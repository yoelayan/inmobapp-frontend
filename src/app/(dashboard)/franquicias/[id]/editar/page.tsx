'use client'

// React Imports
import React from 'react'

// Component Imports
import { FranchiseForm } from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

interface EditFranchiseProps {
  params: {
    id: string
  }
}

const EditFranchise: React.FC<EditFranchiseProps> = ({ params }) => {
  return (
    <>
      <BreadcrumbWrapper />
      <FranchiseForm franchiseId={params.id} />
    </>
  )
}

export default EditFranchise
