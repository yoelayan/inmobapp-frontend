'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@views/apps/properties/list/PropertiesTable'

// Hooks
import useProperties from '@/hooks/api/realstate/useProperties'

// MUI Imports

const Properties: React.FC = () => {
  const { fetchData: getProperties, refreshData: refreshProperties, data: properties } = useProperties()

  useEffect(() => {
    getProperties()
  }, [getProperties])

  return (
    <Grid container spacing={6}>
      <Grid>
        <PropertiesTable properties={properties} refreshProperties={refreshProperties} />
      </Grid>
    </Grid>
  )
}

export default Properties
