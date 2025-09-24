'use client'

// React Imports
import React, { useCallback } from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

// Hooks & Types
import useProperties from '@/hooks/api/realstate/useProperties'

import type { FilterItem, SortingItem } from '@/types/api/response'

interface PageProps { params: { id: string } }

const ClientMatches: React.FC<PageProps> = ({ params }) => {
  const searchId = Number(params.id)

  const { data: properties, loading, fetchMatchedProperties: fetchMatchedProperties, deleteData: deleteProperty } = useProperties()


  const fetchProperties = useCallback(async (params?: { page: number, pageSize: number, filters: FilterItem[], sorting: SortingItem[] }) => {
    return await fetchMatchedProperties(searchId, params)
  }, [fetchMatchedProperties, searchId])

  return (
    <PermissionGuard requiredPermissions={['view_realproperty']}>
      <BreadcrumbWrapper />
      <Grid container spacing={6}>
        <Grid>
          <PropertiesTable
            properties={properties}
            loading={loading}
            fetchProperties={fetchProperties}
            deleteProperty={deleteProperty}
          />
        </Grid>
      </Grid>
    </PermissionGuard>
  )
}

export default ClientMatches
