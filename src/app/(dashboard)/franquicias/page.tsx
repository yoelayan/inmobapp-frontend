'use client'

// React Imports
import React from 'react'

// Component Imports
import FranchisesTable from '@/pages/apps/franchises/list/FranchisesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const Franchises: React.FC = () => {
  return (
    <PermissionGuard requiredPermissions={['view_franchise']}>
      <BreadcrumbWrapper />
      <FranchisesTable />
    </PermissionGuard>
  )
}

export default Franchises
