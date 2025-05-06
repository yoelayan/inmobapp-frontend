import React, { useState, useEffect } from 'react'

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
  isDisabled?: boolean,
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
  const [items, setItems] = useState<OptionType[]>([])

  const [selectedItem, setSelectedItem] = useState<OptionType | null>(null)

  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    if (response) {
      const data = response.results || []

      setItems(
        data.map((item: Record<string, any>) => ({
          value: item[dataMap?.value],
          label: item[dataMap?.label]
        }))
      )
    }
  }, [response, value, dataMap])

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const foundItem = items.find(item => item.value === value)

      setSelectedItem(foundItem || null)
    }
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
      setSelectedItem(item)
      setValue(name, item.value)
    } else {
      setSelectedItem(null)
      setValue(name, null)
    }

    if (onChange) {
      onChange(item)
    }
  }

  const combinedItems = [...(children ? [{ value: 'custom-children', label: '', custom: true }] : []), ...items]


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
              return (
                <div key="custom-children">
                  {children}
                </div>
              )
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
