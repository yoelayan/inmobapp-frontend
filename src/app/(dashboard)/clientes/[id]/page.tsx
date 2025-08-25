'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { Card, CardContent, CardHeader } from '@mui/material'

import { ClientForm } from '@/pages/apps/clients/form/ClientForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const ClientPage: React.FC = () => {
  const params = useParams()
  const clientId = params?.id ? String(params.id) : undefined // Obtiene el ID de la URL si existe

  return (
    <>
      <BreadcrumbWrapper />
      {/* TODO: Enviar card al componente de formulario */}
      <Card className="h-full mt-4">
        <CardHeader title='Actualizar Cliente' />
        <CardContent>
          <ClientForm
            clientId={clientId}
            onSuccess={() => {
              /* Redirigir o mostrar mensaje */
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default ClientPage
