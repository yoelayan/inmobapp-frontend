'use client'

// React Imports
import React, { useState } from 'react'

// MUI Imports
import {
  Box,
  Grid2 as Grid,
  Modal,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'


import { useFormContext } from 'react-hook-form'

// Component Imports
import { Form, PageContainer, FormField } from '@/components/common/forms/Form'

// Hook Imports

import { useNotification } from '@/hooks/useNotification'

// Type Imports
import type { ResponseAPI } from '@/types/api/response'
import type { IClient } from '@/types/apps/ClientesTypes'
import type { IStatus } from '@/types/apps/CatalogTypes'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import type { IUser } from '@/types/apps/UserTypes'


// Components Imports
import  ClientForm  from '@/pages/apps/clients/form/ClientForm'

// Repository Import
import SearchesRepository from '@/services/repositories/crm/SearchesRepository'
import ClientsRepository from '@/services/repositories/crm/ClientsRepository'
import StatesRepository from '@/services/repositories/locations/StatesRepository'
import MunicipalitiesRepository from '@/services/repositories/locations/MunicipalitiesRepository'
import ParishesRepository from '@/services/repositories/locations/ParishesRepository'

// Repositorio personalizado que intercepta los datos

// Schema Import
import {
  createSearchSchema,
  editSearchSchema,
  defaultSearchValues,
  type CreateSearchFormData,
  type EditSearchFormData
} from '@/validations/searchSchema'

// Component Props
interface SearchFormProps {
  searchId?: string
  onSuccess?: (data: CreateSearchFormData | EditSearchFormData) => void
  statuses?: ResponseAPI<IStatus> | null
  users?: ResponseAPI<IUser> | null
  franchises?: ResponseAPI<IFranchise> | null
}

// Component that contains form fields with access to form context
const SearchFormFields: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const [open, setOpen] = useState(false)
  const { setValue, watch } = useFormContext()

  const state = watch('state_id')
  const municipality = watch('municipality_id')

  const handleButtonModal = () => {
    setOpen(!open)
  }

  const handleClientCreated = (response: IClient) => {
    setValue('client_id', response.id)
    handleButtonModal()
  }

  const ModalClient = () => {
    return (
      <Modal
        open={open}
        onClose={handleButtonModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className='flex items-center justify-center p-4'
      >
        <Card className='w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
          <CardContent className='p-6'>
            <Box className='space-y-6'>
              <Box className='flex justify-between items-center'>
                <Typography variant='h5' component='h2' className='text-gray-900 dark:text-white'>
                  Crear Cliente
                </Typography>
                <IconButton
                  onClick={handleButtonModal}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <ClientForm onSuccess={handleClientCreated} />
            </Box>
          </CardContent>
        </Card>
      </Modal>
    )
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormField fullWidth name='budget' label='Presupuesto' type='number' required placeholder='0.00' />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className='flex items-center gap-2'>
            <Box className='flex-1'>
              <FormField
                name='client_id'
                label='Cliente'
                required={mode === 'create'}
                type='async-select'
                repository={ClientsRepository}
              />
            </Box>
            <Button
              sx={{
                minWidth: 'auto',
                height: '56px',
                px: 2
              }}
              onClick={handleButtonModal}
              variant='outlined'
              color='primary'
            >
              <i className='tabler-plus text-[18px]' />
            </Button>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField
            name='state_id'
            label='Estado'
            type='async-select'
            repository={StatesRepository}
            onChange={() => {
              setValue('municipality_id', undefined)
              setValue('parish_id', undefined)
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField
            name='municipality_id'
            label='Municipio'
            type='async-select'
            repository={MunicipalitiesRepository}
            filters={state && (typeof state === 'object' ? state.value : state) ? [{ field: 'state', value: typeof state === 'object' ? state.value : state }] : []}
            disabled={!state || !(typeof state === 'object' ? state.value : state)}
            onChange={() => setValue('parish_id', undefined)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormField
            name='parish_id'
            label='Parroquia'
            type='async-select'
            repository={ParishesRepository}
            filters={state && municipality ? [{ field: 'municipality', value: typeof municipality === 'object' ? municipality.value : municipality }] : []}
            disabled={!state || !municipality}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormField
            fullWidth
            name='description'
            label='Descripción'
            type='text'
            required
            multiline
            rows={3}
            placeholder='Describe lo que busca el cliente...'
          />
        </Grid>
      </Grid>

      <ModalClient />
    </>
  )
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchId,
  onSuccess
}) => {
  const { notify } = useNotification()


  const schema = searchId ? editSearchSchema : createSearchSchema
  const mode = searchId ? 'edit' : 'create'

  // Convertir schema a función para que coincida con el tipo esperado


  console.log('🔍 Debug SearchForm:')
  console.log('  - searchId:', searchId)
  console.log('  - mode:', mode)
  console.log('  - schema:', schema === editSearchSchema ? 'editSearchSchema' : 'createSearchSchema')
  console.log('  - editSearchSchema:', editSearchSchema)
  console.log('  - createSearchSchema:', createSearchSchema)

  const defaultValues = defaultSearchValues

  const handleSuccess = (data: CreateSearchFormData | EditSearchFormData) => {
    console.log('✅ Búsqueda creada/actualizada exitosamente:', data)
    console.log('📊 Tipo de datos:', typeof data)
    console.log('🔍 Datos del formulario:', JSON.stringify(data, null, 2))
    console.log('🎯 Schema usado:', schema === editSearchSchema ? 'editSearchSchema' : 'createSearchSchema')
    console.log('📝 Modo:', mode)
    console.log('🔧 client_id tipo:', typeof data.client_id, 'valor:', data.client_id)

    // Notificar éxito
    if (mode === 'edit') {
      notify('Búsqueda actualizada exitosamente', 'success')
    } else {
      notify('Búsqueda creada exitosamente', 'success')
    }

    onSuccess?.(data)

  }

  const handleError = (error: Error | { message?: string; status?: number }) => {
    console.error('❌ Error en el formulario:', error)
    console.error('🔍 Detalles del error:', {
      message: error instanceof Error ? error.message : error.message,
      status: error instanceof Error ? 'N/A' : error.status,
      error: error
    })
    console.error('📊 Datos que se intentaron enviar:', {
      schema: schema === editSearchSchema ? 'editSearchSchema' : 'createSearchSchema',
      mode: mode,
      searchId: searchId
    })
    const errorMessage = error instanceof Error ? error.message : error.message || 'Error desconocido'

    notify(errorMessage, 'error')
  }



  // Función para formatear los datos antes de enviarlos
  const formatData = (data: CreateSearchFormData | EditSearchFormData) => {
    console.log('🔧 formatData - Datos originales:', data)

    const { client_id, state_id, municipality_id, parish_id } = data

    const formattedData = {
      ...data,
      client_id: client_id?.value,
      state_id: state_id?.value ?? null,
      municipality_id: municipality_id?.value ?? null,
      parish_id: parish_id?.value ?? null
    }

    console.log('🔧 formatData - Datos formateados:', formattedData)

    return formattedData
  }

  return (
    <PageContainer title={searchId ? 'Editar Búsqueda' : 'Crear Búsqueda'}>
      <Form
        schema={schema}
        defaultValues={defaultValues}
        repository={SearchesRepository}
        onSuccess={handleSuccess}
        onError={handleError}
        mode={mode}
        entityId={searchId ? parseInt(searchId) : undefined}
        formatData={formatData}
      >
        <SearchFormFields mode={mode} />
      </Form>
    </PageContainer>
  )
}

export { SearchForm }
export default SearchForm
