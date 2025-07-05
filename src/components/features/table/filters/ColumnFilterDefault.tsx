import React from 'react'

import type { Column, Table } from '@tanstack/react-table'

import Button from '@mui/material/Button'

import CustomTextField from '@core/components/mui/TextField'

interface ColumnFilterDefaultProps {
  column: Column<any, unknown>
  table: Table<any>
}

const ColumnFilterDefault = ({ column, table }: ColumnFilterDefaultProps) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)
  const columnFilterValue = column.getFilterValue()

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    column.setFilterValue((old: [number, number]) => [Number(value), old?.[1]])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    column.setFilterValue((old: [number, number]) => [old?.[0], Number(value)])
  }

  const clearFilter = () => {
    column.setFilterValue([undefined, undefined])
  }

  return typeof firstValue === 'number' ? (
    <div className='flex gap-x-2 items-center'>
      <CustomTextField
        fullWidth
        type='number'
        sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={handleMinChange}
        placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
      />
      <CustomTextField
        fullWidth
        type='number'
        sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={handleMaxChange}
        placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
      />
      <Button variant='outlined' onClick={clearFilter}>
        Limpiar
      </Button>
    </div>
  ) : (
    <CustomTextField
      fullWidth
      sx={{ minInlineSize: 100 }}
      value={(columnFilterValue ?? '') as string}
      onChange={e => {
        const value = e.target.value

        column.setFilterValue(value)
      }}
      placeholder='Buscar...'
    />
  )
}

export default ColumnFilterDefault
