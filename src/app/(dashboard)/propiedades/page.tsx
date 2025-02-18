'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import PropertiesTable from '@views/apps/properties/list/PropertiesTable'
import PropertiesCard from '@views/apps/properties/list/PropertiesCard'

// Hooks
import useProperties from '@/hooks/api/realstate/useProperties'

// MUI Imports
import Grid from '@mui/material/Grid2'

const Properties: React.FC = () => {

  const { 
    fetchData: getProperties, 
    refreshData: refreshProperties, 
    data: properties 
  } = useProperties()

  useEffect(() => {
    getProperties()
  }, [])
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <PropertiesCard />
      </Grid>
      <Grid>
        <PropertiesTable 
          properties={properties}
          refreshProperties={refreshProperties} 
        />
      </Grid>
    </Grid>
  )
}

export default Properties
