'use client'

// React Imports
import React from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Component Imports
import { SearchForm } from '@/pages/apps/searches/form/SearchForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const CreateSearchPage: React.FC = () => {
  const router = useRouter()

  return (
    <PermissionGuard requiredPermissions={['add_search']}>
      <BreadcrumbWrapper />
      <SearchForm onSuccess={() => router.push('/clientes/busquedas')} />
    </PermissionGuard>
  )
}

export default CreateSearchPage
