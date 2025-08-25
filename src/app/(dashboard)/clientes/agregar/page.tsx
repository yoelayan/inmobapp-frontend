'use client'

import React from 'react'

import { Card, CardContent, CardHeader } from '@mui/material'

import { ClientForm } from '@/pages/apps/clients/form/ClientForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const ClientPage: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <Card>
        <CardHeader title='Crear Cliente' />
        <CardContent>
          <ClientForm
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
