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

  // Función para formatear los datos antes de enviarlos al backend
  const formatData = (data: any) => {
    console.log('🔍 formatData ejecutándose con:', data)

    const formattedData = { ...data }

    // Transformar campos async-select de {label, value} a solo value
    const asyncFields = ['franchise_id', 'assigned_to_id']
    const asyncFields = ['franchise_id', 'assigned_to_id']

    // Transformar campos async-select
    asyncFields.forEach(field => {
      if (formattedData[field] && typeof formattedData[field] === 'object' && 'value' in formattedData[field]) {
        console.log(`🔄 Transformando async-select ${field}:`, formattedData[field], '→', formattedData[field].value)
        formattedData[field] = formattedData[field].value
      }
    })

    console.log('✅ Datos transformados:', transformedData)

    return transformedData
    console.log('✅ Datos formateados:', formattedData)
    return formattedData
  }

  // Función para establecer datos del formulario (para modo edición)
  const setFormData = (data: any, methods: any) => {
    console.log('🔍 setFormData ejecutándose con:', data)

    const asyncFields = ['franchise_id', 'assigned_to_id']

    // Establecer campos async-select
    asyncFields.forEach(field => {
      if (data[field]) {
        const value = data[field]

        if (typeof value === 'object' && 'id' in value) {
          // El backend devuelve objetos anidados como {id: 1, name: "Franquicia"}
          methods.setValue(field, {
            label: value.name || value.email || value.identifier || value.id,
            value: value.id
          })
          console.log(`✅ Campo ${field} establecido:`, { label: value.name || value.email || value.identifier || value.id, value: value.id })
        } else if (typeof value === 'number') {
          // Es solo el ID, necesitamos buscar el objeto correspondiente para obtener el label
          const objectKey = field === 'franchise_id' ? 'franchise' : 'assigned_to'
          const objectData = data[objectKey]

          if (objectData && typeof objectData === 'object' && 'id' in objectData) {
            // Usar el objeto anidado para crear el label
            methods.setValue(field, {
              label: objectData.name || objectData.email || objectData.identifier || objectData.id,
              value: value
            })
            console.log(`✅ Campo ${field} establecido con objeto anidado:`, { label: objectData.name || objectData.email || objectData.identifier || objectData.id, value: value })
          } else {
            // Si no hay objeto anidado, solo usar el ID
            methods.setValue(field, value)
            console.log(`✅ Campo ${field} establecido solo con ID:`, value)
          }
        } else {
          // Otro tipo de valor
          methods.setValue(field, value)
          console.log(`✅ Campo ${field} establecido solo con ID:`, value)
        }
      }
    })

    // Establecer otros campos
    Object.entries(data).forEach(([key, value]) => {
      if (!asyncFields.includes(key) && value !== undefined && value !== null) {
        methods.setValue(key, value)
        console.log(`✅ Campo ${key} establecido:`, value)
      }
    })

    console.log('✅ setFormData completado')
  }

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
      setFormData={setFormData}
      transformData={formatData}
    >
      <Grid container spacing={3}>
        {/* --- Campo Nombre (Usando FormField) --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            name='name'
            label='Nombre'
            required
            fullWidth
          />
        </Grid>

        {/* --- Campo Teléfono - ocupa 3 si hay email, 6 si no --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            name='phone'
            label='Telefono'
            required
            fullWidth
          />
        </Grid>

        {/* --- Campo Email - ocupa 3 si hay teléfono, 6 si no --- */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            name='email'
            label='Email'
            fullWidth
          />
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
