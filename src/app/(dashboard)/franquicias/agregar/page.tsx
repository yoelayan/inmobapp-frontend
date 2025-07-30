'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'



import FranchiseForm from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'


import type { CreateFranchiseFormData } from '@/validations/franchiseSchema'





const AddFranchise: React.FC = () => {
  const router = useRouter()

  const handleSuccess = (data: CreateFranchiseFormData) => {
    console.log(data)
    router.push(`/franquicias/`)
  }

  return (
    <>
      <BreadcrumbWrapper />
      <FranchiseForm onSuccess={handleSuccess} />
    </>
  )
}

export default AddFranchise
