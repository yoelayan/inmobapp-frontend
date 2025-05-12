'use client'

// React Imports
import React, { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { Card, CardContent, CardHeader, Box, CircularProgress } from '@mui/material'

// Component Imports
import { SearchForm } from '@/views/apps/searches/form/SearchForm'

// Hook Imports
import useClients from '@/hooks/api/crm/useClients'
import useClientStatus from '@/hooks/api/crm/useClientStatus'
import useUsersByFranchiseRepository from '@/hooks/api/realstate/useUsersByFranchise'
import useFranchises from '@/hooks/api/realstate/useFranchises'

const CreateSearchPage: React.FC = () => {
  const router = useRouter()

  // Get data for form
  const { data: clients, fetchData: fetchClients, refreshData: refreshClients, loading: loadingClients } = useClients()
  const { data: statuses, fetchData: fetchStatuses, loading: loadingStatuses } = useClientStatus()
  const { data: users, fetchData: fetchUsers, loading: loadingUsers } = useUsersByFranchiseRepository()
  const { data: franchises, fetchData: fetchFranchises, loading: loadingFranchises } = useFranchises()

  useEffect(() => {
    fetchClients()
    fetchStatuses()
    fetchUsers()
    fetchFranchises()
  }, [fetchClients, fetchStatuses, fetchUsers, fetchFranchises])

  const handleSuccess = () => {
    router.push('/clientes/search')
  }

  // Show loading while fetching data
  if (loadingClients || loadingStatuses || loadingUsers || loadingFranchises) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos necesarios...</span>
      </Box>
    )
  }

  return (
    <Card>
      <CardHeader title='Crear Búsqueda de Cliente' />
      <CardContent>
        <SearchForm
          onSuccess={handleSuccess}
          clients={clients}
          statuses={statuses}
          users={users}
          franchises={franchises}
          refreshClients={refreshClients}
        />
      </CardContent>
    </Card>
  )
}

export default CreateSearchPage
