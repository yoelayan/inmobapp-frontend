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
  const [localValue, setLocalValue] = useState<string | null>(null)

  // Normaliza el id de la columna a un campo compatible con el backend
  // Ej.: "assigned_to.email" -> "assigned_to__email__icontains"
  const normalizeField = (field: string) => {
    const djangoField = field.includes('.') ? field.replace(/\./g, '__') : field

    return `${djangoField}__icontains`
  }
  
  //esto lo hice porque no sabia que campos se pedian al backend, asi que no creo que accessorKey se tenga que utilizar, pero lo dejo porque asi funciona. teniendo en cuenta que atravez de los logs resolvi el problema en el backend y ya se esta filtrando todo.

  // Usar accessorKey directamente en lugar de column.id para campos anidados
  const accessorKey = (column.columnDef as any).accessorKey as string | undefined
  const rawField = (typeof accessorKey === 'string' ? accessorKey : column.id) || column.id
  
  const backendField = normalizeField(rawField)

  useEffect(() => {
    const existing = state.filters.find(f => f.field === backendField)

    if (existing) {
      setLocalValue(existing.value || '')
    } else {
      // Si no existe el filtro, limpiar el input (para cuando se limpia desde el botón)
      setLocalValue('')
    }
  }, [state.filters, backendField])

  // useDebounce ejecuta la función después de 500ms de que localValue deje de cambiar
  useDebounce(
    () => {
      if (!localValue) return

      if (localValue.trim() === '') {
        state.removeFilter(backendField)
      } else {
        state.addFilter({
          field: backendField,
          value: localValue.trim()
        })
      }
    },
    500,
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
      value={localValue || ''}
      onChange={handleChange}
      placeholder='Buscar...'
    />
  )
}

export default ColumnFilterDefault
