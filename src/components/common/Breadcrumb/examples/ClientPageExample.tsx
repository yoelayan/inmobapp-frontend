'use client'

// React Imports
import React from 'react'

// MUI Imports
import { Card, CardContent, CardHeader, Box } from '@mui/material'

// Component Imports
import { BreadcrumbWrapper } from '../index'
import { ClientForm } from '@/pages/apps/clients/form/ClientForm'

interface ClientPageExampleProps {
  params: {
    id: string
  }
}

/**
 * Ejemplo de integración del Breadcrumb en una página de cliente
 *
 * Este ejemplo muestra cómo:
 * 1. Integrar el breadcrumb automático
 * 2. Usar el wrapper con estilos
 * 3. Mantener la estructura de la página existente
 */
const ClientPageExample: React.FC<ClientPageExampleProps> = ({ params }) => {
  return (
    <Box>
      {/* Breadcrumb automático - detecta la ruta /clientes/[id] */}
      <BreadcrumbWrapper
        showDivider={true}
        marginBottom={24}
        size="medium"
      />

      {/* Contenido original de la página */}
      <Card>
        <CardHeader title='Actualizar Cliente' />
        <CardContent>
          <ClientForm
            clientId={params.id}

            // ... otras props
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default ClientPageExample

/*
  RESULTADO DEL BREADCRUMB PARA DIFERENTES RUTAS:

  /clientes/123:
  Inicio > Clientes > Cliente #123

  /clientes/123/editar:
  Inicio > Clientes > Cliente #123 > Editar [Badge: Editar]

  /clientes/123/coincidencias:
  Inicio > Clientes > Cliente #123 > Coincidencias

  /clientes/busquedas/456:
  Inicio > Clientes > Búsquedas > Búsqueda #456
*/
