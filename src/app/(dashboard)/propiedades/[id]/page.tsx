'use client'

// React Imports
import React, {useEffect} from 'react'

// Component Imports
import { useParams } from 'next/navigation';

import { Box, CircularProgress } from '@mui/material'

import { PropertyForm } from '@/views/apps/properties/form/PropertyForm'

import useUsersByFranchiseRepository from '@/hooks/api/realstate/useUsersByFranchise'
import useFranchises from '@/hooks/api/realstate/useFranchises'
import usePropertyStatus from '@/hooks/api/realstate/usePropertyStatus'
import usePropertyNegotiation from '@/hooks/api/realstate/usePropertyNegotiation'
import usePropertyTypes from '@/hooks/api/realstate/usePropertyTypes'
import useStates from '@/hooks/api/locations/useStates'
import useCities from '@/hooks/api/locations/useCities'
import useClients from '@/hooks/api/crm/useClients'

const PropertyAdd = () => {
  const params = useParams();
  const propertyId = params?.id ? String(params.id) : undefined // Obtiene el ID de la URL si existe

  const { loading: usersLoading, data: users, fetchData: fetchUsers } = useUsersByFranchiseRepository()
    const { loading: franchisesLoading, data: franchises, fetchData: fetchFranchises } = useFranchises()
    const { loading: statusesLoading, data: statuses, fetchData: fetchStatuses } = usePropertyStatus()
    const { loading: negotiationsLoading, data: negotiations, fetchData: fetchNegotiations } = usePropertyNegotiation()
    const { loading: propertyTypesLoading, data: propertyTypes, fetchData: fetchPropertyTypes } = usePropertyTypes()
    const { loading: statesLoading, data: states, fetchData: fetchStates } = useStates()
    const { loading: citiesLoading, data: cities, fetchData: fetchCities } = useCities()
    const { loading: clientsLoading, data: clients, fetchData: fetchClients, refreshData: refreshClients } = useClients()



    useEffect(() => {
      fetchUsers()
      fetchFranchises()
      fetchStatuses()
      fetchNegotiations()
      fetchPropertyTypes()
      fetchStates()
      fetchCities()
      fetchClients()
    }, [
      fetchUsers,
      fetchFranchises,
      fetchStatuses,
      fetchNegotiations,
      fetchPropertyTypes,
      fetchStates,
      fetchCities,
      fetchClients
    ])

  if (
    usersLoading ||
    franchisesLoading ||
    statusesLoading ||
    negotiationsLoading ||
    propertyTypesLoading ||
    statesLoading ||
    citiesLoading ||
    clientsLoading
  ) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos de la propiedad...</span>
      </Box>
    )
  }

  return (
    <PropertyForm
      propertyId={propertyId}
      franchises={franchises}
      users={users}
      statuses={statuses}
      negotiations={negotiations}
      propertyTypes={propertyTypes}
      states={states}
      cities={cities}
      clients={clients}
      refreshClients={refreshClients}
    />
  )
}

export default PropertyAdd
