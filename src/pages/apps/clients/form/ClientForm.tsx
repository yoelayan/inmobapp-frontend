'use client'

import React from 'react'

import { Button, Box, CircularProgress, Grid2 as Grid } from '@mui/material'

import type { ResponseAPI } from '@/api/repositories/BaseRepository'

import { useClientForm } from './hooks/useClientForm'

import TextField from '@/components/form/TextField' // Ajusta la ruta [20]
import SelectField from '@/components/form/SelectField' // Ajusta la ruta [18

import { useNotification } from '@/hooks/useNotification'
import type { IStatus } from '@/types/apps/CatalogTypes'
import type { IClient } from '@/types/apps/ClientesTypes'
import type { IUser } from '@/types/apps/UserTypes'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'

// --- Props del Componente ---
interface ClientFormProps {
  clientId?: string // ID opcional para modo actualización
  statuses: ResponseAPI<IStatus> | null // Lista de 'status' disponibles
  users: ResponseAPI<IUser> | null
  franchises: ResponseAPI<IFranchise> | null

  // Puedes añadir más props si necesitas, como una lista de 'status' disponibles
  onSuccess?: (response: IClient) => void // Callback opcional para después de un envío exitoso
}

export const ClientForm: React.FC<ClientFormProps> = ({ clientId, statuses, users, franchises, onSuccess }) => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    serverError,
    setValue, // Obtenido del hook actualizado
    watch // Obtenido del hook actualizado
  } = useClientForm(clientId, onSuccess)

  const { notify } = useNotification()

  // --- Preparar datos para SelectField ---
  // SelectField [18] espera un objeto 'response' con una propiedad 'results'
  const statusDataMap = { value: 'id', label: 'name' }

  // --- Renderizado Condicional (Carga/Error Inicial) ---
  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos del cliente...</span>
      </Box>
    )
  }

  // Muestra un error general si ocurrió durante la carga inicial o el envío
  // y no está asociado a un campo específico.
  if (serverError && !isLoading && !isSubmitting) {
    notify(serverError, 'error')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* --- Campo Nombre (Usando TextField) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='name'
            label='Nombre'
            control={control}
            error={errors.name}
            setValue={setValue}
            value={watch('name')} // Pasar el valor actual
            // Puedes añadir reglas de validación aquí si quieres duplicar las del hook,
            // pero generalmente es mejor mantenerlas centralizadas en useForm dentro del hook.
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='phone'
            label='Telefono'
            control={control}
            error={errors.phone}
            setValue={setValue}
            value={watch('phone')} // Pasar el valor actual
            // Puedes añadir reglas de validación aquí si quieres duplicar las del hook,
            // pero generalmente es mejor mantenerlas centralizadas en useForm dentro del hook.
          />
        </Grid>
        {/* --- Campo Email (Usando TextField) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='email'
            label='Email'
            control={control}
            error={errors.email}
            setValue={setValue}
            value={watch('email')} // Pasar el valor actual
          />
          {/* Nota: TextField no tiene una prop 'type="email"', la validación
              de formato vendría de las 'rules' en useForm (si las defines)
              o principalmente del backend. */}
        </Grid>
        {/* --- Campo Status (Usando SelectField) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name='status'
            label='Status'
            control={control}
            error={errors.status}
            setValue={setValue}
            value={watch('status')} // Pasar el valor actual (debería ser el ID)
            response={statuses} // Pasar los datos formateados
            dataMap={statusDataMap} // Pasar el mapeo de campos
            // isDisabled={...} // Puedes añadir lógica de deshabilitado si es necesario
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name='franchise'
            label='Franquicia'
            control={control}
            error={errors.franchise}
            setValue={setValue}
            value={watch('franchise')}
            response={franchises}
            dataMap={{ value: 'id', label: 'name' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name='assigned_to'
            label='Usuario Asignado'
            control={control}
            error={errors.assigned_to}
            setValue={setValue}
            value={watch('assigned_to')}
            response={users}
            dataMap={{ value: 'id', label: 'email' }}
          />
        </Grid>
        {/* --- Botón de Envío a la izquierda--- */} {/** 100% width en movil */}
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <Button type='submit' variant='contained' disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Guardando...' : clientId ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
