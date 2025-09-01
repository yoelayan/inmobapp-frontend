import React, { useState, useEffect } from 'react'

import type { Column } from '@tanstack/react-table'

import CustomTextField from '@core/components/mui/TextField'
import { useTableContext } from '../TableContext'
import debounce from '@/utils/debounce'

interface ColumnFilterDefaultProps {
  column: Column<any, unknown>
}

const ColumnFilterDefault = ({ column }: ColumnFilterDefaultProps) => {
  const { state } = useTableContext()
  const [localValue, setLocalValue] = useState('')

  useEffect(() => {
    if (state.filters.find(f => f.field === column.id)) {
      setLocalValue(state.filters.find(f => f.field === column.id)?.value || '')
    }
  }, [state.filters, column.id])


  // Función debounced para aplicar el filtro al store
  const debouncedAddFilter = debounce((...args: unknown[]) => {
    const value = String(args[0])

    if (value.trim() === '') {
      state.removeFilter(column.id)
    } else {
      state.addFilter({
        field: column.id,
        value: value.trim()
      })
    }
  }, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setLocalValue(value)
    debouncedAddFilter(value)
  }

  return (
    <CustomTextField
      fullWidth
      sx={{ minInlineSize: 100 }}
      value={localValue}
      onChange={handleChange}
      placeholder='Buscar...'
    />
  )
}

export default ColumnFilterDefault
