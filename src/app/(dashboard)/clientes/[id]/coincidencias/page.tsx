'use client'

// React Imports
import React, { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

// Component Imports

import Grid from '@mui/material/Grid2'
import { CircularProgress } from '@mui/material'

import PropertiesTable from '@views/apps/properties/list/PropertiesTable'
import useSearches from '@/hooks/api/crm/useSearches'
import useProperties from '@/hooks/api/realstate/useProperties'

// Types
import type { IRealProperty } from '@/types/apps/RealtstateTypes'
import type { ResponseAPI } from '@/api/repositories/BaseRepository'

const ClientMatches: React.FC = () => {
  const params = useParams()
  const clientId = params.id as string
  const [matchedProperties, setMatchedProperties] = useState<ResponseAPI<IRealProperty> | null>(null)
  const [loading, setLoading] = useState(true)

  const { getMatchedProperties, fetchItemById, item: client_search } = useSearches()
  const { deleteData: deleteProperty } = useProperties()

  const refreshProperties = async () => {
    setLoading(true)

    try {
      const response = await getMatchedProperties(clientId)

      setMatchedProperties(response || [])
    } catch (error) {
      console.error('Error refreshing properties:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItemById(clientId)
  }, [fetchItemById, clientId])

  useEffect(() => {
    if (!client_search) return

    const fetchMatchedProperties = async () => {
      try {
        const response = await getMatchedProperties(clientId)

        setMatchedProperties(response)
      } catch (error) {
        console.error('Error fetching matched properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchedProperties()
  }, [getMatchedProperties, clientId, client_search])

  return loading ? (
    <CircularProgress />
  ) : (
    <Grid container spacing={6}>
      <Grid>
        <PropertiesTable
          title='Propiedades encontradas'
          subtitle={`Estas visualizando las propiedades encontradas para el cliente: ${client_search?.client?.name}`}
          properties={matchedProperties}
          refreshProperties={refreshProperties}
          deleteProperty={deleteProperty}
        />
      </Grid>
    </Grid>
  )
}

export default ClientMatches
