'use client'

// React Imports
import React from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import type { EditRoleFormData } from '@validations/roleSchema'

import RoleForm from '@/pages/apps/roles/form/RoleForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

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
    <PermissionGuard requiredPermissions={['change_role']}>
      <BreadcrumbWrapper />
      <RoleForm roleId={roleId} mode='edit' onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default EditRole
