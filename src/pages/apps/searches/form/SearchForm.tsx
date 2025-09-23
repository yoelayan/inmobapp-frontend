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

import type { UseFormReturn } from 'react-hook-form'

// Component Imports
import { Form, PageContainer, FormField } from '@/components/common/forms/Form'

// Hook Imports

import { useNotification } from '@/hooks/useNotification'

// Type Imports
import type { ResponseAPI } from '@/types/api/response'
import type { ISearch, IClient } from '@/types/apps/ClientesTypes'
import type { IStatus } from '@/types/apps/CatalogTypes'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import type { IUser } from '@/types/apps/UserTypes'


// Components Imports
import  ClientForm  from '@/pages/apps/clients/form/ClientForm'

// Repository Import
import SearchesRepository from '@/services/repositories/crm/SearchesRepository'
import ClientsRepository from '@/services/repositories/crm/ClientsRepository'

// Repositorio personalizado que intercepta los datos

// Schema Import
import {
  createSearchSchema,
  editSearchSchema,
  type CreateSearchFormData,
  type EditSearchFormData
} from '@/validations/searchSchema'

// Component Props
interface SearchFormProps {
  searchId?: string
  onSuccess?: (response: ISearch) => void
  statuses?: ResponseAPI<IStatus> | null
  users?: ResponseAPI<IUser> | null
  franchises?: ResponseAPI<IFranchise> | null
}

// Component that contains form fields with access to form context
const SearchFormFields: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const [open, setOpen] = useState(false)
  const { setValue } = useFormContext()

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

export const SearchForm: React.FC<SearchFormProps> = ({
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

  const defaultValues: Partial<CreateSearchFormData> = {
    description: '',
    budget: 0.01,
    client_id: undefined
  }

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

    if (onSuccess) {
      onSuccess(data as ISearch)
    }
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

    const setFormData = (data: ISearch, methods: UseFormReturn<EditSearchFormData>) => {
    console.log('🔧 setFormData - Datos recibidos:', data)
    console.log('🔧 setFormData - data.client:', data.client)
    console.log('🔧 setFormData - data.client_id:', data.client_id)

    const formData: EditSearchFormData = {
      description: data.description,
      budget: data.budget,
      client_id: data.client ? {
        value: data.client.id,
        label: data.client.name
      } : undefined
    }

    console.log('🔧 setFormData - Datos formateados para el formulario:', formData)
    console.log('🔧 setFormData - formData.client_id:', formData.client_id)
    methods.reset(formData)
  }

  // Función para formatear los datos antes de enviarlos
  const formatData = (data: CreateSearchFormData | EditSearchFormData) => {
    console.log('🔧 formatData - Datos originales:', data)

    const formattedData = {
      ...data,
      client_id: typeof data.client_id === 'object' && data.client_id !== null
        ? (data.client_id as any).value
        : data.client_id
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
        setFormData={setFormData}
        formatData={formatData}
      >
        <SearchFormFields mode={mode} />
      </Form>
    </PageContainer>
  )
}
