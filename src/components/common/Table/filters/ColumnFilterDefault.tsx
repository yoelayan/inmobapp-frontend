import React, { useState, useEffect } from 'react'

import { useDebounce } from 'react-use'
import type { Column } from '@tanstack/react-table'

import CustomTextField from '@core/components/mui/TextField'

import { useTableContext } from '../TableContext'

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

  // useDebounce ejecuta la función después de 2 segundos de que localValue deje de cambiar
  useDebounce(
    () => {
      if (localValue.trim() === '') {
        state.removeFilter(column.id)
      } else {
        state.addFilter({
          field: column.id,
          value: localValue.trim()
        })
      }
    },
    2000, // 2 segundos
    [localValue]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setLocalValue(value)
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
