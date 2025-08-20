import React, { useState, useMemo, useCallback } from 'react'

// Types
import { MenuItem } from '@mui/material'

import Autocomplete from '@mui/material/Autocomplete'

import { Controller } from 'react-hook-form'

import type { ResponseAPI } from '@/types/api/response'
import type FieldProps from '@/components/features/form/BaseField'

// MUI Imports

import CustomTextField from '@core/components/mui/TextField'
import { SearchMenuItem } from '@/components/common/forms/fields/SearchMenuItem'

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
  minSearchLength?: number
  debounceTime?: number
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
  children,
  minSearchLength = 2,
  debounceTime = 300
}: SelectFieldAsyncProps) => {
  // Estado para las opciones de búsqueda (separadas de las opciones seleccionadas)
  const [searchOptions, setSearchOptions] = useState<OptionType[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Calcular items directamente desde la respuesta
  const items = useMemo(() => {
    if (!response) return []

    const data = response.results || []

    return data.map((item: Record<string, any>) => ({
      value: item[dataMap?.value],
      label: item[dataMap?.label]
    }))
  }, [response, dataMap])

  // Combinar items originales con opciones de búsqueda
  const allItems = useMemo(() => {
    const itemsMap = new Map()

    // Agregar items originales
    items.forEach(item => {
      itemsMap.set(item.value, item)
    })

    // Agregar opciones de búsqueda (sin sobrescribir las originales)
    searchOptions.forEach(option => {
      if (!itemsMap.has(option.value)) {
        itemsMap.set(option.value, option)
      }
    })

    return Array.from(itemsMap.values())
  }, [items, searchOptions])

  // Encontrar el item seleccionado directamente
  const selectedItem = useMemo(() => {
    if (value === undefined || value === null) {
      return null
    }

    return allItems.find((item: OptionType) => item.value === value) || null
  }, [value, allItems])

  // Callback para manejar resultados de búsqueda
  const handleSearchResults = useCallback((results: any[]) => {
    const mappedResults = results.map((item: any) => ({
      value: item[dataMap?.value] || item.value,
      label: item[dataMap?.label] || item.label
    }))
    setSearchOptions(mappedResults)
    setIsSearching(false)
  }, [dataMap])

  // Callback para manejar el inicio de búsqueda
  const handleSearchStart = useCallback(() => {
    setIsSearching(true)
  }, [])

  // Adaptar refreshData para el SearchMenuItem
  const adaptedRefreshData = useCallback(async (params: any) => {
    if (refreshData) {
      const response = await refreshData({ [filter_name ?? 'search']: params.filters[0]?.value })

      if (response) {
        return response
      }
    }

    return {
      count: 0,
      page_number: 1,
      num_pages: 1,
      next: null,
      previous: null,
      results: []
    }
  }, [refreshData, filter_name])

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
    return [...(children ? [{ value: 'custom-children', label: '', custom: true }] : []), ...allItems]
  }, [children, allItems])

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
          loading={isSearching}
          renderInput={params => (
            <CustomTextField
              {...params}
              fullWidth
              placeholder='Seleccionar opción...'
              label={label}
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
          PaperComponent={({ children: menuChildren, ...paperProps }) => (
            <div {...paperProps}>
              {refreshData && (
                <SearchMenuItem
                  refreshData={adaptedRefreshData}
                  minSearchLength={minSearchLength}
                  debounceTime={debounceTime}
                  onSearchResults={handleSearchResults}
                  onSearchStart={handleSearchStart}
                  loading={isSearching}
                  searchPlaceholder="Buscar opciones..."
                />
              )}
              {menuChildren}
            </div>
          )}
        />
      )}
    />
  )
}

export default SelectFieldAsync
