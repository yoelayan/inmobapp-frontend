'use client'

import React, { useEffect, useRef } from 'react'

import { Box, CircularProgress, Grid2 as Grid } from '@mui/material'

import { useAuth } from '@auth/hooks/useAuth'


import { Form, FormField } from '@components/common/forms/Form'

import { useNotification } from '@/hooks/useNotification'
import useClientStatus from '@/hooks/api/crm/useClientStatus'
import type { IClient } from '@/types/apps/ClientesTypes'

// Importar repositorios para async-select
import ClientsRepository from '@/services/repositories/crm/ClientsRepository'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import UsersRepository from '@/services/repositories/users/UsersRepository'

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

const ClientForm: React.FC<ClientFormProps> = ({ clientId, onSuccess }) => {
  const { notify } = useNotification()
  const { user } = useAuth()
  const isSuperuser = user?.is_superuser || false

  // --- Cargar datos directamente en el componente (como PropertyForm) ---
  const { data: statuses, fetchData: fetchStatuses } = useClientStatus()

  // Cargar datasets una sola vez (evita loops por identidades inestables)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true

    fetchStatuses()
  }, [fetchStatuses])


  // --- Renderizado Condicional (Carga Inicial) ---
  if (!statuses) {
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

  const formatData = (data: CreateClientFormData | EditClientFormData) => {
    // Extraer id de los async-select
    const { franchise_id, assigned_to_id } = data

    const payload = {
      ...data,
      franchise_id: franchise_id?.value,
      assigned_to_id: assigned_to_id?.value
    }

    return payload
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
      formatData={formatData}
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

        {/* --- Campos solo visibles para superusuarios --- */}
        {isSuperuser && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormField
              name='franchise_id'
              type='async-select'
              label='Franquicia'
              repository={FranchisesRepository}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormField
              name='assigned_to_id'
              type='async-select'
              label='Usuario asignado'
              repository={UsersRepository}
            />
          </Grid>
          </>
        )}

      </Grid>
    </Form>
  )
}

export default ClientForm
