'use client'

// React Imports
import React from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PermissionGuard from '@/auth/hocs/PermissionGuard'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'


// Disable static generation for this page since it uses context providers
export const dynamic = 'force-dynamic'

// MUI Imports

const Properties: React.FC = () => {
  return (
    <PermissionGuard requiredPermissions={['view_realproperty']}>
      <BreadcrumbWrapper />
      <Grid container spacing={6}>
        <Grid>
          <PropertiesTable
          />
        </Grid>
      </Grid>
    </PermissionGuard>
  )
}

export default Properties
