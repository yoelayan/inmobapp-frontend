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

// Component Imports
import { Form, PageContainer, TextField, FormField } from '@/components/common/forms/Form'

// Hook Imports
import { useFormContext } from 'react-hook-form'

import { useNotification } from '@/hooks/useNotification'

// Type Imports
import type { ResponseAPI } from '@/types/api/response'
import type { ISearch, IClient } from '@/types/apps/ClientesTypes'
import type { IStatus } from '@/types/apps/CatalogTypes'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import type { IUser } from '@/types/apps/UserTypes'

import type { UseFormReturn } from 'react-hook-form'


// Components Imports
import { ClientForm } from '@/pages/apps/clients/form/ClientForm'

// Repository Import
import SearchesRepository from '@/services/repositories/crm/SearchesRepository'
import ClientsRepository from '@/services/repositories/crm/ClientsRepository'

// Repositorio personalizado que intercepta los datos
const CustomSearchesRepository = {
  ...SearchesRepository,
  update: async (id: number, data: any) => {
    console.log('🔧 CustomSearchesRepository.update - Datos originales:', data)

    // Transformar client_id si es un objeto
    const transformedData = {
      ...data,
      client_id: typeof data.client_id === 'object' && data.client_id !== null
        ? data.client_id.value
        : data.client_id
    }

    console.log('🔧 CustomSearchesRepository.update - Datos transformados:', transformedData)

    // Llamar al repositorio original con datos transformados
    return await SearchesRepository.update(id, transformedData)
  },

  create: async (data: any) => {
    console.log('🔧 CustomSearchesRepository.create - Datos originales:', data)

    // Transformar client_id si es un objeto
    const transformedData = {
      ...data,
      client_id: typeof data.client_id === 'object' && data.client_id !== null
        ? data.client_id.value
        : data.client_id
    }

    console.log('🔧 CustomSearchesRepository.create - Datos transformados:', transformedData)

    // Llamar al repositorio original con datos transformados
    return await SearchesRepository.create(transformedData)
  }
}

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

export const SearchForm: React.FC<SearchFormProps> = ({
  searchId,
  onSuccess
}) => {
  const { notify } = useNotification()
  const [open, setOpen] = useState(false)

  const handleButtonModal = () => {
    setOpen(!open)
  }

  // Componente interno que usa el contexto del formulario
  const ClientSelector = () => {
    const { setValue } = useFormContext()

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
          className="flex items-center justify-center p-4"
        >
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <Box className="space-y-6">
                <Box className="flex justify-between items-center">
                  <Typography variant='h5' component='h2' className="text-gray-900 dark:text-white">
                    Crear Cliente
                  </Typography>
                  <IconButton
                    onClick={handleButtonModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <ClientForm
                  onSuccess={handleClientCreated}
                />
              </Box>
            </CardContent>
          </Card>
        </Modal>
      )
    }

    return (
      <div className="space-y-3">
        <FormField
          name='client_id'
          label='Cliente'
          required={mode === 'create'}
          type='async-select'
          repository={ClientsRepository}
        />
        <Button
          onClick={handleButtonModal}
          variant="outlined"
          color="primary"
          startIcon={<span className="tabler-user-plus" />}
          className="w-full justify-start"
        >
          Crear un nuevo cliente
        </Button>
        <ModalClient />
      </div>
    )
  }

  const schema = searchId ? editSearchSchema : createSearchSchema
  const mode = searchId ? 'edit' : 'create'

  console.log('🔍 Debug SearchForm:')
  console.log('  - searchId:', searchId)
  console.log('  - mode:', mode)
  console.log('  - schema:', schema === editSearchSchema ? 'editSearchSchema' : 'createSearchSchema')
  console.log('  - editSearchSchema:', editSearchSchema)
  console.log('  - createSearchSchema:', createSearchSchema)

  const defaultValues: Partial<CreateSearchFormData> = {
    description: '',
    budget: 0,
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
    const formData: EditSearchFormData = {
      description: data.description,
      budget: data.budget,
      client_id: data.client_id
    }

    methods.reset(formData)
  }

  // Función para formatear los datos antes de enviarlos
  const formatData = (data: CreateSearchFormData | EditSearchFormData) => {
    console.log('🔧 formatData - Datos originales:', data)

    const formattedData = {
      ...data,
      client_id: typeof data.client_id === 'object' && data.client_id !== null
        ? data.client_id.value
        : data.client_id
    }

    console.log('🔧 formatData - Datos formateados:', formattedData)

    return formattedData
  }

  // Función personalizada para transformar datos justo antes del envío
  const handleSubmit = (formData: any) => {
    console.log('🚀 handleSubmit - Datos antes de transformar:', formData)

    // Transformar client_id si es un objeto
    const transformedData = {
      ...formData,
      client_id: typeof formData.client_id === 'object' && formData.client_id !== null
        ? formData.client_id.value
        : formData.client_id
    }

    console.log('🚀 handleSubmit - Datos transformados:', transformedData)

    return transformedData
  }

  // Componente personalizado que intercepta el envío
  const CustomForm = () => {
    const { handleSubmit: formHandleSubmit, getValues } = useFormContext()

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const formData = getValues()
      console.log('🚀 onSubmit - Datos del formulario:', formData)

      // Transformar client_id antes de enviar
      const transformedData = {
        ...formData,
        client_id: typeof formData.client_id === 'object' && formData.client_id !== null
          ? formData.client_id.value
          : formData.client_id
      }

      console.log('🚀 onSubmit - Datos transformados:', transformedData)

      // Aquí enviaríamos los datos transformados
      // Por ahora, solo logueamos
    }

    return (
      <form onSubmit={onSubmit}>
        <Grid container spacing={3} className="p-6">
          <Grid size={{ xs: 12 }}>
            <TextField
              name='description'
              label='Descripción'
              fullWidth
              required
              multiline
              rows={3}
              placeholder='Describe lo que estás buscando...'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name='budget'
              label='Presupuesto'
              type='number'
              fullWidth
              required
              placeholder='0.00'
              inputProps={{
                min: 0,
                step: 0.01
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientSelector />
          </Grid>
        </Grid>
      </form>
    )
  }

  return (
    <PageContainer title={searchId ? 'Editar Búsqueda' : 'Crear Búsqueda'}>
      <Form
        schema={schema}
        defaultValues={defaultValues}
        repository={CustomSearchesRepository}
        onSuccess={handleSuccess}
        onError={handleError}
        mode={mode}
        entityId={searchId ? parseInt(searchId) : undefined}
        setFormData={setFormData}
        formatData={formatData}
      >
        <Grid container spacing={3} className="p-6">
          <Grid size={{ xs: 12 }}>
            <TextField
              name='description'
              label='Descripción'
              fullWidth
              required
              multiline
              rows={3}
              placeholder='Describe lo que estás buscando...'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name='budget'
              label='Presupuesto'
              type='number'
              fullWidth
              required
              placeholder='0.00'
              inputProps={{
                min: 0,
                step: 0.01
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ClientSelector />
          </Grid>
        </Grid>
      </Form>
    </PageContainer>
  )
}
