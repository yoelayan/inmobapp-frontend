import React, { useMemo } from 'react'

// Types
import { MenuItem } from '@mui/material'

import { Controller } from 'react-hook-form'

import type { ResponseAPI } from '@/services/repositories/BaseRepository'
import type FieldProps from '@/components/features/form/BaseField'

// MUI Imports
import CustomTextField from '@core/components/mui/TextField'

// React Hook Form Imports

interface OptionType {
  value: string
  label: string
}

interface SelectFieldAsyncProps extends FieldProps {
  response: ResponseAPI<any> | null
  dataMap: Record<string, any>
  onChange?: (value: any) => void
  defaultFilter?: Record<string, any>
  isDisabled?: boolean
  multiple?: boolean
}

const SelectField = ({
  value,
  label,
  name,
  control,
  error,
  response,
  dataMap,
  onChange,
  isDisabled,
  setValue,
  multiple
}: SelectFieldAsyncProps) => {
  // Calcular items directamente desde la respuesta usando useMemo
  const items = useMemo(() => {
    if (!response) return []

    const data = response.results || []

    return data.map((item: Record<string, any>) => ({
      value: item[dataMap?.value],
      label: item[dataMap?.label]
    }))
  }, [response, dataMap])

  // Encontrar el item seleccionado directamente sin estado adicional
  const selectedValue = useMemo(() => {
    if (value === undefined || value === null || value === '') {
      return ''
    }

    const foundItem = items.find(item => item.value === value)

    return foundItem ? foundItem.value : ''
  }, [value, items])

  const handleSelectChange = (value: string) => {
    if (value === '') {
      setValue(name, null)

      if (onChange) {
        onChange(null)
      }

      return
    }

    const item = items.find((item: OptionType) => item.value === value)

    setValue(name, item ? item.value : null)

    if (onChange) {
      onChange(item)
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label={label}
          value={selectedValue}
          onChange={e => handleSelectChange(e.target.value)}
          disabled={isDisabled}
          error={!!error}
          helperText={error?.message}
          fullWidth
          size='small'
          select
        >
          <MenuItem value=''>
            <em>Seleccionar elemento</em>
          </MenuItem>
          {items.map((item: OptionType) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </CustomTextField>
      )}
    />
  )
}

export default SelectField
