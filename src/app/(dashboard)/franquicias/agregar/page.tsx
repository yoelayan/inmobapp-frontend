'use client'

// React Imports
import React from 'react'

// Component Imports
import { FranchiseForm } from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const AddFranchise: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <FranchiseForm />
    </>
  )
}

export default AddFranchise
