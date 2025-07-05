'use client'

import React from 'react'

import { Button, Box, CircularProgress, Grid2 as Grid, Typography, Divider } from '@mui/material'

import type { FieldError } from 'react-hook-form'

import type { ResponseAPI } from '@/services/repositories/BaseRepository'
import { useUserForm } from './hooks/useUserForm'

import TextField from '@/components/features/form/TextField'
import SelectField from '@/components/features/form/SelectField'
import SwitchField from '@/components/features/form/SwitchField'
import ImageField from '@/components/features/form/ImageField'

import { useNotification } from '@/hooks/useNotification'

import type { IUser } from '@/types/apps/UserTypes'


// Necesitamos crear un hook para obtener grupos
// Para ahora, usaremos datos mock
interface IGroup {
  id: number
  name: string
}

interface UserFormProps {
  userId?: string
  onSuccess?: (response: IUser) => void
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onSuccess }) => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    serverError,
    setValue,
    watch
  } = useUserForm(userId, onSuccess)

  const { notify } = useNotification()

  // TODO: Reemplazar con un hook real para obtener grupos
  const mockGroups: IGroup[] = [
    { id: 1, name: 'Administradores' },
    { id: 2, name: 'Usuarios' },
    { id: 3, name: 'Editores' }
  ]

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos del usuario...</span>
      </Box>
    )
  }

  if (serverError && !isLoading && !isSubmitting) {
    notify(serverError, 'error')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Información básica */}
        <Grid size={12}>
          <Typography variant='h6' component='h2' gutterBottom>
            Información Personal
          </Typography>
          <Divider />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='name'
            label='Nombre Completo'
            control={control}
            error={errors.name}
            setValue={setValue}
            value={watch('name')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='email'
            label='Email'
            control={control}
            error={errors.email}
            setValue={setValue}
            value={watch('email')}
          />
        </Grid>

        <Grid size={12}>
          <ImageField
            name='image'
            label='Imagen de Perfil'
            control={control}
            error={errors.image}
            setValue={setValue}
            value={watch('image')}
          />
        </Grid>

        {/* Credenciales */}
        <Grid size={12}>
          <Typography variant='h6' component='h2' gutterBottom sx={{ mt: 3 }}>
            Credenciales
          </Typography>
          <Divider />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='password'
            label={userId ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            control={control}
            error={errors.password}
            setValue={setValue}
            value={watch('password')}
            type='password'
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='password_confirm'
            label='Confirmar Contraseña'
            control={control}
            error={errors.password_confirm}
            setValue={setValue}
            value={watch('password_confirm')}
            type='password'
          />
        </Grid>

        {/* Permisos */}
        <Grid size={12}>
          <Typography variant='h6' component='h2' gutterBottom sx={{ mt: 3 }}>
            Permisos y Estado
          </Typography>
          <Divider />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <SwitchField
            name='is_active'
            label='Usuario Activo'
            control={control}
            error={errors.is_active}
            setValue={setValue}
            value={watch('is_active')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <SwitchField
            name='is_staff'
            label='Acceso al Admin'
            control={control}
            error={errors.is_staff}
            setValue={setValue}
            value={watch('is_staff')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <SwitchField
            name='is_superuser'
            label='Superusuario'
            control={control}
            error={errors.is_superuser}
            setValue={setValue}
            value={watch('is_superuser')}
          />
        </Grid>

        <Grid size={12}>
          <SelectField
            name='groups'
            label='Grupos'
            control={control}
            error={errors.groups as FieldError}
            setValue={setValue}
            value={watch('groups')}
            response={{ results: mockGroups } as ResponseAPI<IGroup>}
            dataMap={{ value: 'id', label: 'name' }}
            multiple={true}
          />
        </Grid>

        {/* Botón de envío */}
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            mt: 3
          }}
        >
          <Button type='submit' variant='contained' disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Guardando...' : userId ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
