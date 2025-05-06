'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, Box, CircularProgress } from '@mui/material'

import { ClientForm } from '@/views/apps/clients/form/ClientForm';
import useClientStatus from '@/hooks/api/crm/useClientStatus'
import useUsersByFranchiseRepository from '@/hooks/api/realstate/useUsersByFranchise'
import useFranchises from '@/hooks/api/realstate/useFranchises'


const ClientPage: React.FC = () => {
  const params = useParams();
  const clientId = params?.id ? String(params.id) : undefined; // Obtiene el ID de la URL si existe

  const { data: statuses, fetchData: fetchStatuses, loading: loadingStatuses } = useClientStatus()
    const { data: users, fetchData: fetchUsers, loading: loadingUsers } = useUsersByFranchiseRepository()
    const { data: franchises, fetchData: fetchFranchises, loading: loadingFranchises } = useFranchises()

    useEffect(() => {
      fetchUsers()
      fetchFranchises()
      fetchStatuses()
    }, [fetchUsers, fetchFranchises, fetchStatuses])




    if (loadingStatuses || loadingUsers || loadingFranchises) {
      return (
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
          <CircularProgress />
          <span style={{ marginLeft: '10px' }}>Cargando datos del Cliente...</span>
        </Box>
      )
    }

  return (
    <Card>
          <CardHeader title='Actualizar Cliente' />
      <CardContent>
          <ClientForm
        clientId={clientId}
        statuses={statuses} // Pasa la lista de statuses al formulario
        users={users}
        franchises={franchises}

        // onSuccess={() => { /* Redirigir o mostrar mensaje */ }} // Callback opcional
      />
      </CardContent>
    </Card>

  )
};

export default ClientPage;
