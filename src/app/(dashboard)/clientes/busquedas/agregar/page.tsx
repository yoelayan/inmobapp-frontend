'use client'

// React Imports
import React from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { Card, CardContent, CardHeader } from '@mui/material'

// Component Imports
import { SearchForm } from '@/pages/apps/searches/form/SearchForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const CreateSearchPage: React.FC = () => {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/clientes/busquedas')
  }

  return (
    <PermissionGuard requiredPermissions={['add_search']}>
      <BreadcrumbWrapper />
      <Card>
        <CardHeader title='Crear Búsqueda de Cliente' />
        <CardContent>
          <SearchForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

export default CreateSearchPage
