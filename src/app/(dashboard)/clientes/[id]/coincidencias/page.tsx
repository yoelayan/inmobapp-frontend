'use client'

// React Imports
import React from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const ClientMatches: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <Grid container spacing={6}>
      <Grid>
        <PropertiesTable />
      </Grid>
    </Grid>
    </>
  )
}

export default ClientMatches
