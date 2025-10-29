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

  // Normaliza el id de la columna a un campo compatible con el backend
  // Ej.: "assigned_to.email" -> "assigned_to__email__icontains"
  const normalizeField = (field: string) => {
    const djangoField = field.includes('.') ? field.replace(/\./g, '__') : field

    return `${djangoField}__icontains`
  }

  const backendField = normalizeField(column.id)

  useEffect(() => {
    const existing = state.filters.find(f => f.field === backendField)

    if (existing) {
      setLocalValue(existing.value || '')
    }
  }, [state.filters, backendField])

  // useDebounce ejecuta la función después de 2 segundos de que localValue deje de cambiar
  useDebounce(
    () => {
      if (localValue.trim() === '') {
        state.removeFilter(backendField)
        state.fetchData()
      } else {
        state.addFilter({
          field: backendField,
          value: localValue.trim()
        })
        state.fetchData()
      }
    },
    2000, // 2 segundos
    [localValue, backendField]
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
