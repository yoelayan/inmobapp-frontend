import React, { useState, useCallback } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import type { FieldValues } from 'react-hook-form'

import {
  Autocomplete,
  TextField as MUITextField,
  CircularProgress,
  type TextFieldProps as MUITextFieldProps,
  MenuItem
} from '@mui/material'

import { SearchMenuItem } from './SearchMenuItem'
import type { AsyncSelectFieldProps, AsyncSelectOption } from '@/types/common/forms.types'

export const AsyncSelectField = <T extends FieldValues, V extends MUITextFieldProps>({
  name,
  label,
  refreshData,
  placeholder = 'Seleccionar opción...',
  noOptionsText = 'No se encontraron opciones',
  loadingText = 'Cargando...',
  minSearchLength = 2,
  multiple = false,
  freeSolo = false,
  disabled = false,
  required = false,
  loading = false,
  options = [],
  debounceTime = 300,
  ...props
}: AsyncSelectFieldProps<T> & V) => {
  console.log('render AsyncSelectField')
  const { control } = useFormContext()

  // Estado para las opciones de búsqueda (separadas de las opciones seleccionadas)
  const [searchOptions, setSearchOptions] = useState<AsyncSelectOption[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Combinar opciones originales con opciones de búsqueda
  const allOptions = React.useMemo(() => {
    const optionsMap = new Map()

    // Agregar opciones originales
    options.forEach(option => {
      optionsMap.set(option.value, option)
    })

    // Agregar opciones de búsqueda (sin sobrescribir las originales)
    searchOptions.forEach(option => {
      if (!optionsMap.has(option.value)) {
        optionsMap.set(option.value, option)
      }
    })

    return Array.from(optionsMap.values())
  }, [options, searchOptions])

  // Callback para manejar resultados de búsqueda
  const handleSearchResults = useCallback((results: AsyncSelectOption[]) => {
    setSearchOptions(results)
    setIsSearching(false)
  }, [])

  // Callback para manejar el inicio de búsqueda
  const handleSearchStart = useCallback(() => {
    setIsSearching(true)
  }, [])


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
          // Para múltiples valores, buscar cada uno en todas las opciones (incluyendo búsqueda)
          fieldValue = Array.isArray(field.value)
            ? field.value.map((val: any) => {
                const foundOption = allOptions.find(opt => opt.value === val)

                return foundOption || val
              })
            : []
        } else {
          // Para valor único, buscar en todas las opciones (incluyendo búsqueda)
          const foundOption = allOptions.find(opt => opt.value === field.value)

          fieldValue = foundOption ?? field.value
        }

        return (
          <Autocomplete
            value={fieldValue}
            multiple={multiple}
            freeSolo={freeSolo}
            options={allOptions}
            loading={loading || isSearching}
            disabled={disabled}
            open={undefined} // Permitir que el Autocomplete maneje su propio estado
            onChange={(event, newValue) => {
              // Extraer solo el valor (ID) para enviarlo al formulario
              if (multiple) {
                const values = Array.isArray(newValue)
                  ? newValue.map(option =>
                      typeof option === 'object' && option && 'value' in option ? option.value : option
                    )
                  : []

                field.onChange(values)
              } else {
                const value =
                  newValue && typeof newValue === 'object' && 'value' in newValue ? newValue.value : newValue

                field.onChange(value)
              }
            }}
            onBlur={field.onBlur}
            getOptionLabel={option => {
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
            noOptionsText={noOptionsText}
            loadingText={loadingText}
            renderInput={params => (
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
                  }
                }}
                slots={{
                  endAdornment: () => (
                    <>
                      {(loading || isSearching) ? <CircularProgress color='inherit' size={20} /> : null}
                      {params.InputProps?.endAdornment}
                    </>
                  )
                }}
                {...props}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.value} className="!py-2 !px-4">
                {option.label}
              </MenuItem>
            )}
            slotProps={{
              ...props.slotProps,
              paper: {
                ...((props.slotProps && props.slotProps.paper) || {}),
                className: 'overflow-visible', // optional: ensure dropdown isn't clipped
                children: (
                  <>
                    {refreshData && (
                      <SearchMenuItem
                        refreshData={refreshData}
                        minSearchLength={minSearchLength}
                        debounceTime={debounceTime}
                        onSearchResults={handleSearchResults}
                        onSearchStart={handleSearchStart}
                        loading={isSearching}
                        searchPlaceholder="Buscar opciones..."
                      />
                    )}
                  </>
                ),
              },
            }}
          />
        )
      }}
    />
  )
}
