'use client'

import React, { useEffect } from 'react'

import { Button, Box, CircularProgress, Grid2 as Grid } from '@mui/material'

import type { ResponseAPI } from '@/services/repositories/BaseRepository'
import { useFranchiseForm } from './hooks/useFranchiseForm'

import TextField from '@/components/features/form/TextField'
import SelectField from '@/components/features/form/SelectField'

import { useNotification } from '@/hooks/useNotification'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import useFranchises from '@/hooks/api/realstate/useFranchises'

interface FranchiseFormProps {
  franchiseId?: string
  onSuccess?: (response: IFranchise) => void
}

export const FranchiseForm: React.FC<FranchiseFormProps> = ({ franchiseId, onSuccess }) => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    serverError,
    setValue,
    watch
  } = useFranchiseForm(franchiseId, onSuccess)

  const { notify } = useNotification()

  // Hook para obtener franquicias padre
  const { data: franchises, fetchData: fetchFranchises } = useFranchises()

  useEffect(() => {
    fetchFranchises()
  }, [fetchFranchises])

  // Datos para el campo de tipo de franquicia
  const franchiseTypeOptions = [
    { value: 'COMMERCIAL', label: 'Comercial' },
    { value: 'PERSONAL', label: 'Personal' }
  ]

  // Preparar datos para franquicias padre (excluir la franquicia actual)
  const parentFranchiseOptions = franchises?.results?.filter(f => f.id !== parseInt(franchiseId || '0')) || []

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos de la franquicia...</span>
      </Box>
    )
  }

  if (serverError && !isLoading && !isSubmitting) {
    notify(serverError, 'error')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='identifier'
            label='Identificador'
            control={control}
            error={errors.identifier}
            setValue={setValue}
            value={watch('identifier')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name='name'
            label='Nombre'
            control={control}
            error={errors.name}
            setValue={setValue}
            value={watch('name')}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name='franchise_type'
            label='Tipo de Franquicia'
            control={control}
            error={errors.franchise_type}
            setValue={setValue}
            value={watch('franchise_type')}
            response={{ results: franchiseTypeOptions } as ResponseAPI<any>}
            dataMap={{ value: 'value', label: 'label' }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectField
            name='parent'
            label='Franquicia Padre'
            control={control}
            error={errors.parent}
            setValue={setValue}
            value={watch('parent')}
            response={{ results: parentFranchiseOptions } as ResponseAPI<IFranchise>}
            dataMap={{ value: 'id', label: 'name' }}
          />
        </Grid>

        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <Button type='submit' variant='contained' disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Guardando...' : franchiseId ? 'Actualizar Franquicia' : 'Crear Franquicia'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
