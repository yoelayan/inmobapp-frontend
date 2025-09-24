'use client'

// React Imports
import React from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Component Imports
import { SearchForm } from '@/pages/apps/searches/form/SearchForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'
import type { ISearch } from '@/types/apps/SearchTypes'

const CreateSearchPage: React.FC = () => {
  const router = useRouter()

  const handleSuccess = (search: ISearch) => {
    console.log('Search created:', search)
    router.push('/clientes/busquedas')
  }

  return (
    <PermissionGuard requiredPermissions={['add_search']}>
      <BreadcrumbWrapper />
      <SearchForm onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default CreateSearchPage
