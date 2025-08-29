'use client'

import React from 'react'

import RolesTable from '@/pages/apps/roles/list/RolesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const RolesPage = () => {
  return (
    <PermissionGuard requiredPermissions={['view_role']}>
      <BreadcrumbWrapper />
      <RolesTable />
    </PermissionGuard>
  )
}

export default RolesPage
