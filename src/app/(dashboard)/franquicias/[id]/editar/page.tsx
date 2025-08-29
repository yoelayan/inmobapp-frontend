'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'

// Component Imports
import FranchiseForm from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

import type { EditFranchiseFormData } from '@/validations/franchiseSchema'


type EditFranchiseProps = {
  params: Promise<{
    id: string
  }>
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
    <PermissionGuard requiredPermissions={['change_franchise']}>
      <BreadcrumbWrapper />
      <FranchiseForm franchiseId={franchiseId} mode='edit' onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default EditFranchise
