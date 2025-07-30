'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'

import type { z } from 'zod'

// Component Imports
import FranchiseForm from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

import type { EditFranchiseFormData } from '@/validations/franchiseSchema'


type params = {
  id: string
}

interface EditFranchiseProps {
  params: params
}


const EditFranchise: React.FC<EditFranchiseProps> = ({ params }) => {
  const router = useRouter()

  const handleSuccess = (data: EditFranchiseFormData) => {
    console.log(data)
    router.push(`/franquicias/`)
  }

  const { id } = React.use(params)
  const franchiseId = Number(id)

  return (
    <>
      <BreadcrumbWrapper />
      <FranchiseForm franchiseId={franchiseId} mode='edit' onSuccess={handleSuccess} />
    </>
  )
}

export default EditFranchise
