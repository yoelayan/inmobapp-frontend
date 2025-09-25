'use client'

// React Imports
import React, { useCallback } from 'react'

import { useParams } from 'next/navigation'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

// Hooks & Types
import useProperties from '@/hooks/api/realstate/useProperties'

import type { FilterItem, SortingItem } from '@/types/api/response'

const ClientMatches = () => {
  const params = useParams<{ id: string }>()
  const searchId = Number(params?.id ?? '0')

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
            showCards={false}
          />
        </Grid>
      </Grid>
    </PermissionGuard>
  )
}

export default ClientMatches
