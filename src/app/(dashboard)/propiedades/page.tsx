'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Hooks
import useProperties from '@/hooks/api/realstate/useProperties'

// MUI Imports

const Properties: React.FC = () => {
  const { fetchData: getProperties, refreshData: refreshProperties, data: properties, deleteData: deleteProperty } = useProperties()

  useEffect(() => {
    getProperties()
  }, [getProperties])

  return (
    <>
      <BreadcrumbWrapper />
      <Grid container spacing={6}>
      <Grid>
        <PropertiesTable properties={properties} refreshProperties={refreshProperties} deleteProperty={deleteProperty} />
      </Grid>
    </Grid>
    </>
  )
}

export default Properties
