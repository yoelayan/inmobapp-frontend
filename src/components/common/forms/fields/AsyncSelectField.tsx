
import React, { useState, useCallback, useMemo, useEffect } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import type { FieldValues } from 'react-hook-form'

import {
  Autocomplete,
  TextField as MUITextField,
  CircularProgress,
  type TextFieldProps as MUITextFieldProps,
} from '@mui/material'

import type { AsyncSelectFieldProps, } from '@/types/common/forms.types'


export const AsyncSelectField = <T extends FieldValues, V extends MUITextFieldProps>({
  name,
  label,
  loadOptions,
  placeholder = 'Buscar y seleccionar...',
  noOptionsText = 'No se encontraron opciones',
  loadingText = 'Cargando...',
  minSearchLength = 2,
  debounceTime = 300,
  multiple = false,
  freeSolo = false,
  disabled = false,
  required = false,
  loading = false,
  options = [],
  ...props
}: AsyncSelectFieldProps<T> & V) => {
  const { control } = useFormContext()

  // Estados para manejar las opciones y carga\
  const [inputValue, setInputValue] = useState('')

  // Función debounced para realizar búsquedas
  const debouncedLoadOptions = useCallback(
    useMemo(() => {
      let timeoutId: NodeJS.Timeout

      return (searchTerm: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(async () => {
          if (searchTerm.length >= minSearchLength || minSearchLength === 0) {

            try {
              await loadOptions({
                page: 1,
                pageSize: 50,
                filters: [{
                  field: 'search',
                  value: searchTerm
                }],
                sorting: []
              })

            } catch (error) {
              console.error('Error cargando opciones:', error)
            }
          }
        }, debounceTime)
      }
    }, [loadOptions, minSearchLength, debounceTime]),
    [loadOptions, minSearchLength, debounceTime]
  )

  // Cargar opciones iniciales cuando el componente se monta
  useEffect(() => {
    if (minSearchLength === 0) {
      debouncedLoadOptions('')
    }
  }, [debouncedLoadOptions, minSearchLength])

  // Manejar cambios en el input de búsqueda
  const handleInputChange = useCallback((event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue)
    debouncedLoadOptions(newInputValue)
  }, [debouncedLoadOptions])

  return (
    <Controller
      control={control}
      name={name}
                  render={({ field, fieldState: { error } }) => {
        // Convertir el valor del formulario (ID) a objeto para Autocomplete
                    let fieldValue

        if (field.value === null || field.value === undefined || field.value === '') {
          fieldValue = multiple ? [] : null
        } else if (multiple) {

          // Para múltiples valores, buscar cada uno en las opciones
          fieldValue = Array.isArray(field.value) ? field.value.map(val => {
            const foundOption = options.find(opt => opt.value === val)

            return foundOption || val
          }) : []
        } else {
          // Para valor único, buscar en las opciones
          const foundOption = options.find(opt => opt.value === field.value)

          fieldValue = foundOption ?? field.value
        }

        return (
          <Autocomplete
            {...field}
            value={fieldValue}
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            loading={loading}
            disabled={disabled}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={(event, newValue) => {
              // Extraer solo el valor (ID) para enviarlo al formulario
              if (multiple) {
                const values = Array.isArray(newValue) ? newValue.map(option =>
                  typeof option === 'object' && option && 'value' in option ? option.value : option
                ) : []

                field.onChange(values)
              } else {
                const value = newValue && typeof newValue === 'object' && 'value' in newValue
                  ? newValue.value
                  : newValue

                field.onChange(value)
              }
            }}
            getOptionLabel={(option) => {
              // Manejar diferentes tipos de opciones
              if (typeof option === 'string') return option

              if (typeof option === 'object' && option && 'label' in option) {
                return option.label
              }

              return ''
            }}
            isOptionEqualToValue={(option, value) => {
              // Comparaciones cruzadas para string/objeto
              if (typeof option === 'string' && typeof value === 'string') {
                return option === value
              }

              if (typeof option === 'object' && option && 'value' in option) {
                if (typeof value === 'object' && value && 'value' in value) {
                  return option.value === value.value
                }

                if (typeof value === 'string') {
                  return option.value === value
                }
              }

              if (typeof value === 'object' && value && 'value' in value && typeof option === 'string') {
                return value.value === option
              }

              return false
            }}
            noOptionsText={
              inputValue.length < minSearchLength
                ? `Escribe al menos ${minSearchLength} caracteres para buscar`
                : noOptionsText
            }
            loadingText={loadingText}
            renderInput={(params) => (
              <MUITextField
                {...params}
                label={label}
                placeholder={placeholder}
                required={required}
                error={!!error}
                helperText={error?.message}
                variant='outlined'
                slotProps={{
                  inputLabel: {
                    shrink: true
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                {...props}
              />
            )}
          />
        )
      }}
    />
  )
}
