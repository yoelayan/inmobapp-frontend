'use client'

// React Imports
import React from 'react'

// Component Imports
import SearchesTable from '@/pages/apps/searches/list/SearchesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const SearchesPage: React.FC = () => {
  return (
    <PermissionGuard requiredPermissions={['view_search']}>
      <BreadcrumbWrapper />
      <SearchesTable />
    </PermissionGuard>
  )
}

export default SearchesPage
