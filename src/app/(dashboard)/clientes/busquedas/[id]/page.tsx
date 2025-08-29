'use client'

// React Imports
import React from 'react'

import { useRouter } from 'next/navigation'

// Component Imports
import { SearchForm } from '@/pages/apps/searches/form/SearchForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

// Types

function SearchPage({ params }: any) {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirigir a la tabla de búsquedas
    router.push('/clientes/busquedas')
  }

  return (
    <PermissionGuard requiredPermissions={['change_search']}>
      <BreadcrumbWrapper />
      <SearchForm searchId={params.id} onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default SearchPage
