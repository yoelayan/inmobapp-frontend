'use client'

// React Imports
import React from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import RoleForm from '@/pages/apps/roles/form/RoleForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'
import type { CreateRoleFormData, EditRoleFormData } from '@/validations/roleSchema'

const CreateRole: React.FC = () => {
  const router = useRouter()

  const handleSuccess = (data: CreateRoleFormData | EditRoleFormData) => {
    console.log('Rol creado:', data)
    router.push(`/roles/`)
  }

  return (
    <PermissionGuard requiredPermissions={['add_role']}>
      <BreadcrumbWrapper />
      <RoleForm onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default CreateRole
