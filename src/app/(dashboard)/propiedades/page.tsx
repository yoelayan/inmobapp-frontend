'use client'

// React Imports
import React from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Hooks
import useProperties from '@/hooks/api/realstate/useProperties'

// MUI Imports

const Properties: React.FC = () => {
  const { fetchData: fetchProperties, data: properties, deleteData: deleteProperty, loading } = useProperties()

  // Función para manejar cambios en el filtro de status
  const handleStatusFilterChange = (status: string | null) => {
    // Esta función se puede usar para sincronizar el estado del filtro
    // entre las cards y la tabla si es necesario
    console.log('Status filter changed:', status)
  }

  return (
    <>
      <BreadcrumbWrapper />
      <Grid container spacing={6}>
      <Grid>
          <PropertiesTable
            properties={properties}
            loading={loading}
            fetchProperties={fetchProperties}
            deleteProperty={deleteProperty}
            onStatusFilterChange={handleStatusFilterChange}
          />
      </Grid>
    </Grid>
    </>
  )
}

export default Properties
