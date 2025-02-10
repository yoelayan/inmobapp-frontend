// React Imports
import { useEffect, useState } from 'react'

// Types Imports
import type { Column, Table } from '@tanstack/react-table'


// Mui Imports
import { MenuItem } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import type { ResponseAPI } from '@/repositories/BaseRepository'
import CustomTextField from '@core/components/mui/TextField'

interface OptionType {
  value: string
  label: string
}

interface ColumnFilterSelectProps {
  column: Column<any, unknown>
  table: Table<any>
  options?: Record<string, any>[]
  searchble?: boolean
  response?: { results: Record<string, any>[] }
  refreshData?: (filters?: Record<string, any>) => Promise<ResponseAPI<any>>
  dataMap?: Record<string, any>
  filter_name?: string
  onChange?: (value: any) => void
}

const ColumnFilterSelect = ({
  column,
  table,
  options,
  response,
  refreshData,
  dataMap,
  searchble,
  filter_name,
  onChange
}: ColumnFilterSelectProps) => {
  // Alert: Cannot use options and responsePromise at the same time
  if (options && response) {
    console.warn(column.id, 'Cannot use options and response at the same time. Please use only one of them.')
  }

  // Alert: If response is provided, refreshData must be provided
  if (response && !refreshData) {
    console.warn(column.id, 'If response is provided, refreshData must be provided.')
  }

  const columnFilterValue = column.getFilterValue()
  const [items, setItems] = useState<OptionType[]>([])
  const [selectedItem, setSelectedItem] = useState<OptionType | null>(null)
  const [inputValue, setInputValue] = useState<string>('')

  const buildItems = () => {
    console.log('Options', response)

    if (options) {
      setItems(options as OptionType[])
    } else if (response) {
      const data = response.results

      console.log('Data', data)
      setItems(
        data.map((item: Record<string, any>) => ({
          value: item[dataMap?.value],
          label: item[dataMap?.label]
        }))
      )
    }
  }

  useEffect(() => {
    buildItems()
  }, [response])

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (refreshData) {
      refreshData({ [filter_name ?? 'search']: e.target.value })
    } else {
      const filteredItems = items?.filter((item: Record<string, any>) => {
        return item.label.toLowerCase().includes(e.target.value.toLowerCase())
      })

      setItems(filteredItems)
    }

    setInputValue(e.target.value)
  }

  const handleSelectChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: OptionType | null,
    reason: string
  ) => {
    // Handle the change event
    if (value) {
      column.setFilterValue(value.value)
      setSelectedItem(value)
    } else {
      column.setFilterValue('')
      setSelectedItem(null)
    }

    if (onChange) {
      onChange(value)
    }
  }

  return (
    <>
      <Autocomplete
        fullWidth
        value={selectedItem ?? null}
        onChange={handleSelectChange}
        clearText='Limpiar'
        options={items ?? []}
        sx={{ minWidth: 200 }}
        getOptionLabel={(option: OptionType) => option.label}
        renderInput={params => (
          <CustomTextField
            {...params}
            fullWidth
            placeholder='Buscar...'
            onChange={handleSearchChange}
            value={inputValue}
            sx={{ minWidth: 100 }}
          />
        )}
        renderOption={(props, option: OptionType) => (
          <MenuItem {...props} key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        )}
      />
    </>
  )
}

export default ColumnFilterSelect
