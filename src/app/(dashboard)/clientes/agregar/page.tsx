'use client'

import React, { useEffect } from 'react'

import { Card, CardContent, CardHeader } from '@mui/material'

import { ClientForm } from '@/pages/apps/clients/form/ClientForm'
import useClientStatus from '@/hooks/api/crm/useClientStatus'
import useUsersByFranchiseRepository from '@/hooks/api/realstate/useUsersByFranchise'

import useFranchises from '@/hooks/api/realstate/useFranchises'

const ClientPage: React.FC = () => {
  const { data: statuses, fetchData: fetchStatuses } = useClientStatus()
  const { data: users, fetchData: fetchUsers } = useUsersByFranchiseRepository()
  const { data: franchises, fetchData: fetchFranchises } = useFranchises()


  useEffect(() => {
    fetchUsers()
    fetchFranchises()
    fetchStatuses()
  }, [fetchUsers, fetchFranchises, fetchStatuses])


  return (
    <Card>
      <CardHeader title='Crear Cliente' />
      <CardContent>
        <ClientForm
          statuses={statuses} // Pasa la lista de statuses al formulario
          users={users}
          franchises={franchises}
          onSuccess={() => {
            /* Redirigir o mostrar mensaje */
          }} // Callback opcional
        />
      </CardContent>
    </Card>
  )
}

export default ClientPage
