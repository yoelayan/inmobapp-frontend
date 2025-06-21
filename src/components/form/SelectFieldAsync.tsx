import React, { useState, useMemo } from 'react'

// Types
import { MenuItem } from '@mui/material'

import Autocomplete from '@mui/material/Autocomplete'

import { Controller } from 'react-hook-form'

import type { ResponseAPI } from '@/api/repositories/BaseRepository'
import type FieldProps from '@/components/form/BaseField'

// MUI Imports

import CustomTextField from '@core/components/mui/TextField'

// React Hook Form Imports

interface OptionType {
  value: string
  label: string
  custom?: boolean
}

interface SelectFieldAsyncProps extends FieldProps {
  response: ResponseAPI<any> | null
  refreshData?: (filters?: Record<string, any>) => Promise<void>
  dataMap: Record<string, any>
  filter_name?: string
  onChange?: (item: any) => void
  defaultFilter?: Record<string, any>
  isDisabled?: boolean
  children?: React.ReactNode
}

const SelectFieldAsync = ({
  value,
  label,
  name,
  control,
  response,
  refreshData,
  dataMap,
  filter_name,
  onChange,
  isDisabled,
  error,
  setValue,
  children
}: SelectFieldAsyncProps) => {
  // Estado solo para el valor de entrada (búsqueda)
  const [inputValue, setInputValue] = useState<string>('')

  // Calcular items directamente desde la respuesta
  const items = useMemo(() => {
    if (!response) return []

    const data = response.results || []

    return data.map((item: Record<string, any>) => ({
      value: item[dataMap?.value],
      label: item[dataMap?.label]
    }))
  }, [response, dataMap])

  // Encontrar el item seleccionado directamente
  const selectedItem = useMemo(() => {
    if (value === undefined || value === null) {
      return null
    }

    return items.find(item => item.value === value) || null
  }, [value, items])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (refreshData) {
      refreshData({ [filter_name ?? 'search']: e.target.value })
    }

    setInputValue(e.target.value)
  }

  const handleSelectChange = (event: React.SyntheticEvent<Element, Event>, item: OptionType | null) => {
    // Handle the change event
    if (item) {
      setValue(name, item.value)
    } else {
      setValue(name, null)
    }

    if (onChange) {
      onChange(item)
    }
  }

  // Combinar items con elementos hijos personalizados
  const combinedItems = useMemo(() => {
    return [...(children ? [{ value: 'custom-children', label: '', custom: true }] : []), ...items]
  }, [children, items])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          fullWidth
          value={selectedItem}
          onChange={handleSelectChange}
          clearText='Limpiar'
          options={combinedItems ?? []}
          getOptionLabel={(option: OptionType) => option.label ?? ''}
          disabled={isDisabled}
          renderInput={params => (
            <CustomTextField
              {...params}
              fullWidth
              placeholder='Buscar...'
              label={label}
              onChange={handleSearchChange}
              value={inputValue}
              error={!!error}
              helperText={error?.message}
              sx={{ minWidth: 100 }}
            />
          )}
          renderOption={(props, option: OptionType) => {
            if (option.custom) {
              return <div key='custom-children'>{children}</div>
            }

            return (
              <MenuItem {...props} key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            )
          }}
        />
      )}
    />
  )
}

export default SelectFieldAsync
