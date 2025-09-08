'use client'

import React from 'react'

import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader } from '@mui/material'

import ClientForm from '@/pages/apps/clients/form/ClientForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const ClientPage: React.FC = () => {
  const router = useRouter()

  return (
    <PermissionGuard requiredPermissions={['add_client']}>
      <BreadcrumbWrapper />
      <Card className='h-screen mt-4'>
        <CardHeader title='Crear Cliente' />
        <CardContent>
          <ClientForm
            onSuccess={() => {
              router.push('/clientes/')
            }}
          />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

export default ClientPage
