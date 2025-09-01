'use client'

import React, { useEffect } from 'react'

import { useForm, FormProvider, type FieldValues, type DefaultValues, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Box } from '@mui/material'

import type { BaseFormProps } from '@/types/common/forms.types'

import { useFormRepository } from '@hooks/forms/useFormRepository'
import { FormActions } from './FormActions'
import { FormError } from './FormError'
import { isAsyncSelectField } from '@/validations/common'


export const Form = <T extends FieldValues>({
  schema,
  defaultValues,
  repository,
  onSuccess,
  onError,
  children,
  mode = 'create',
  entityId,
  setFormData,
  formatData,
  actionsComponent
}: BaseFormProps<T>) => {

  const schemaToUse = typeof schema === 'function' ? schema() : schema

  const methods = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(schemaToUse)
  })

  const { initialData, isLoadingData, submitForm, isLoading, error } = useFormRepository({
    repository,
    mode,
    entityId,
    onSuccess,
    onError
  })

  useEffect(() => {
    if (setFormData && initialData) {
      setFormData(initialData, methods)
    } else if (initialData && mode === 'edit') {
      // Get only the schema field names (not internal zod keys)
      // For zod object schemas, the shape is in .shape or ._def.shape()

      const shape = (schemaToUse as any).shape

      const schemaKeys = Object.keys(shape)


      schemaKeys.forEach(key => {
        if (key in initialData) {
          // Verificar si el campo es del tipo asyncSelectValidation
          if (isAsyncSelectField(shape[key])) {
            console.log('Campo asyncSelectValidation encontrado:', key)
            const keyWithoutId = key.replace('_id', '') // franchise_id -> franchise

            const newObject = {
              value: initialData[keyWithoutId]?.id,
              label: initialData[keyWithoutId]?.name
            }

            methods.setValue(key as Path<T>, newObject as any)
          } else {
            methods.setValue(key as Path<T>, initialData[key])
          }
        }
      })
    }

    console.log(methods.getValues())
  }, [initialData, mode, methods, setFormData, schemaToUse])

  // Manejar errores de validación del backend
  useEffect(() => {
    if (error && error.status === 400 && error.response.data) {
      const validationErrors = error.response.data

      // Limpiar errores previos
      methods.clearErrors()

      // Establecer errores para cada campo que tenga errores de validación
      Object.keys(validationErrors).forEach(fieldName => {
        const fieldErrors = validationErrors[fieldName]

        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          // Concatenar todos los errores del array
          const allErrors = fieldErrors.join(', ')

          methods.setError(fieldName as Path<T>, {
            type: 'server',
            message: allErrors
          })
        }
      })
    }
  }, [error, methods])

  // Detectar si hay valores object con label y value, extraer el value y setearlo en el campo
  const handleObjectValues = (data: Record<string, any>) => {
    Object.keys(data).forEach(key => {
      const value = data[key]

      // No procesar campos async-select (client_id, franchise_id, etc.)
      if (key.endsWith('_id')) {
        return
      }

      if (
        value !== null &&
        typeof value === 'object' &&
        'label' in value &&
        'value' in value
      ) {
        methods.setValue(key as Path<T>, value.value)
      }
    })
  }

  const onSubmit = (data: T) => {
    if (repository) {
      // Formatear los datos antes del envío si existe formatData
      const finalData = formatData ? formatData(data) : data

      handleObjectValues(finalData)

      console.log('Submitting form:', finalData)
      console.log('Form data keys:', Object.keys(finalData))
      console.log('Form data values:', Object.values(finalData))

      submitForm(finalData as T)
    } else {
      // Si no hay repository, ejecutar onSuccess directamente
      onSuccess?.(data)
    }
  }

  if (isLoadingData) {
    return <Box>Cargando datos...</Box>
  }

  return (
    <FormProvider {...methods}>
      <Box
        component='form'
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        autoComplete='off'
      >
        <Box display='flex' flexDirection='column' gap={2}>
          {children}
        </Box>

        <FormError error={error} />
        {actionsComponent || (
          <FormActions
            loading={isLoading}
            mode={mode}
            onReset={() => methods.reset()}
            disabled={false}
          />
        )}
      </Box>
    </FormProvider>
  )
}
