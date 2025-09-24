'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// Component Imports
import Grid from '@mui/material/Grid2'

import PropertiesTable from '@/pages/apps/properties/list/PropertiesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Hooks & Types
import useSearches from '@/hooks/api/crm/useSearches'
import type { IRealProperty } from '@/types/apps/RealtstateTypes'

interface PageProps { params: { id: string } }

const ClientMatches: React.FC<PageProps> = ({ params }) => {
  const searchId = Number(params.id)
  const { getMatchedProperties } = useSearches()
  const [matches, setMatches] = useState<IRealProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const resp = await getMatchedProperties(searchId)

        if (mounted) setMatches((resp as any).results || [])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (searchId) load()

    return () => { mounted = false }
  }, [getMatchedProperties, searchId])

  return (
    <>
      <BreadcrumbWrapper />
      <Grid container spacing={6}>
        <Grid>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <PropertiesTable dataOverride={matches} />
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default ClientMatches
