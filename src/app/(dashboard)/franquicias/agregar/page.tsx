'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'



import FranchiseForm from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'


import type { CreateFranchiseFormData, EditFranchiseFormData } from '@/validations/franchiseSchema'





const AddFranchise: React.FC = () => {
  const router = useRouter()

  const handleSuccess = (data: CreateFranchiseFormData | EditFranchiseFormData) => {
    console.log(data)
    router.push(`/franquicias/`)
  }

  return (
    <PermissionGuard requiredPermissions={['add_franchise']}>
      <BreadcrumbWrapper />
      <FranchiseForm onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default AddFranchise
