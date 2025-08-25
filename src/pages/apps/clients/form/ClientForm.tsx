'use client'

import React, { useEffect, useRef } from 'react'

import { Box, CircularProgress, Grid2 as Grid } from '@mui/material'


import { Form, FormField } from '@components/common/forms/Form'

import { useNotification } from '@/hooks/useNotification'
import useClientStatus from '@/hooks/api/crm/useClientStatus'
import useUsers from '@/hooks/api/users/useUsers'
import useFranchises from '@/hooks/api/realstate/useFranchises'
import type { IClient } from '@/types/apps/ClientesTypes'

// Importar repositorios para async-select
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import UsersRepository from '@/services/repositories/users/UsersRepository'
import ClientsRepository from '@/services/repositories/crm/ClientsRepository'

// Importar esquemas de validación
import {
  createClientSchema,
  editClientSchema,
  defaultClientValues,
  type CreateClientFormData,
  type EditClientFormData
} from '@/validations/clientSchema'

// --- Props del Componente ---
interface ClientFormProps {
  clientId?: string // ID opcional para modo actualización
  onSuccess?: (response: IClient) => void // Callback opcional para después de un envío exitoso
}

export const ClientForm: React.FC<ClientFormProps> = ({ clientId, onSuccess }) => {
  const { notify } = useNotification()

  // --- Cargar datos directamente en el componente (como PropertyForm) ---
  const { data: statuses, fetchData: fetchStatuses } = useClientStatus()
  const { data: users, fetchData: fetchUsers } = useUsers()
  const { data: franchises, fetchData: fetchFranchises } = useFranchises()

  // Cargar datasets una sola vez (evita loops por identidades inestables)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true

    fetchStatuses()
    fetchUsers()
    fetchFranchises()
  }, [])


  // --- Renderizado Condicional (Carga Inicial) ---
  if (!statuses || !users || !franchises) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span className="ml-2 text-gray-600 text-base">Cargando datos...</span>
      </Box>
    )
  }

  // Determinar el esquema a usar
  const schema = clientId ? editClientSchema : createClientSchema


  const handleSuccess = (client: CreateClientFormData | EditClientFormData) => {
    console.log(`Cliente ${clientId ? 'actualizado' : 'creado'}:`, client)
    notify(`Cliente ${clientId ? 'actualizado' : 'creado'} exitosamente`, 'success')
    onSuccess?.(client as IClient)
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario:', error)
    notify('Error al procesar el formulario', 'error')
  }

  return (
    <Form
      schema={schema}
      defaultValues={defaultClientValues}
      repository={ClientsRepository}
      mode={clientId ? 'edit' : 'create'}
      entityId={clientId ? Number(clientId) : undefined}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      <Grid container spacing={3}>
        {/* --- Campo Nombre (Usando FormField) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField name='name' label='Nombre' required fullWidth />
        </Grid>

        {/* --- Campo Teléfono - ocupa 3 si hay email, 6 si no --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField name='phone' label='Telefono' required fullWidth />
        </Grid>

        {/* --- Campo Email - ocupa 3 si hay teléfono, 6 si no --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField name='email' label='Email' fullWidth />
        </Grid>

        {/* --- Campo Status (Usando FormField) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            name='status'
            type='select'
            label='Status'
            required
            fullWidth
            options={statuses?.results?.map((status: any) => ({ value: status.id, label: status.name })) || []}
          />
        </Grid>

        {/* --- Campo Franquicia (Usando FormField con async-select) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            type='async-select'
            name='franchise_id'
            label='Franquicia'
            required
            repository={FranchisesRepository}
          />
        </Grid>

        {/* --- Campo Usuario Asignado (Usando FormField con async-select) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            type='async-select'
            name='assigned_to_id'
            label='Usuario Asignado'
            required
            repository={UsersRepository}
          />
        </Grid>
      </Grid>
    </Form>
  )
}
