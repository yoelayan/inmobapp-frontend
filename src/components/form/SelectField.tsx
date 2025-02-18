import React, { useState, useEffect } from 'react'

// Types
import { MenuItem } from '@mui/material'

import { Controller } from 'react-hook-form'

import type { ResponseAPI } from '@/api/repositories/BaseRepository'
import type FieldProps from '@/components/form/BaseField'

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
  setValue
}: SelectFieldAsyncProps) => {
  const [items, setItems] = useState<OptionType[]>([])

  const [selectedItem, setSelectedItem] = useState<OptionType | null>(value || null)

  useEffect(() => {
    buildItems()
  }, [response])

  const buildItems = () => {
    if (response) {
      const data = response.results || []

      setItems(
        data.map((item: Record<string, any>) => ({
          value: item[dataMap?.value],
          label: item[dataMap?.label]
        }))
      )
    }
  }

  const handleSelectChange = (value: string) => {
    const item = items.find((item: OptionType) => item.value === value)

    if (item) {
      setSelectedItem(item)
      setValue(name, item)
    } else {
      setSelectedItem(null)
      setValue(name, null)
    }

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
          value={selectedItem ? selectedItem.value : 'None'}
          onChange={e => handleSelectChange(e.target.value)}
          disabled={isDisabled}
          error={!!error}
          helperText={error?.message}
          fullWidth
          size='small'
          select
        >
          <MenuItem value='None'>
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
