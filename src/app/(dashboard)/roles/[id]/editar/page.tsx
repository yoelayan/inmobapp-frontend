'use client'

// React Imports
import React from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import type { EditRoleFormData } from '@validations/roleSchema'

import RoleForm from '@/pages/apps/roles/form/RoleForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

type EditRoleProps = {
  params: Promise<{
    id: string
  }>
}

const EditRole: React.FC<EditRoleProps> = ({ params }) => {
  const router = useRouter()

  const handleSuccess = (data: EditRoleFormData) => {
    console.log('Rol actualizado:', data)
    router.push(`/roles/`)
  }

  const { id } = React.use(params)
  const roleId = Number(id)

  return (
    <>
      <BreadcrumbWrapper />
      <RoleForm roleId={roleId} mode='edit' onSuccess={handleSuccess} />
    </>
  )
}

export default EditRole
