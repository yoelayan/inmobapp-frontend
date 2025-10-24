'use client'

import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader } from '@mui/material'

import ClientForm from '@/pages/apps/clients/form/ClientForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const ClientPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const clientId = params?.id ? String(params.id) : undefined // Obtiene el ID de la URL si existe

  const handleSuccess = () => {
    console.log('Cliente actualizado exitosamente')
    router.push('/clientes/')
  }

  return (
    <PermissionGuard requiredPermissions={['change_client']}>
      <BreadcrumbWrapper />
      {/* TODO: Enviar card al componente de formulario */}
      <Card className="h-full mt-4">
        <CardHeader title='Actualizar Cliente' />
        <CardContent>
          <ClientForm
            clientId={clientId}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

export default ClientPage
