// components/Table/index.tsx
import React from 'react'

import { Paper } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'

import { TableProvider } from './TableContext'
import type { TableState } from './types'

interface TableProps<T> {
  columns: ColumnDef<T>[]
  state: TableState<T>
  children: React.ReactNode
}

export function Table<T>({ columns, state, children }: TableProps<T>) {
  return (
    <TableProvider columns={columns} state={state}>
      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
        {children}
      </Paper>
    </TableProvider>
  )
}

// Exportamos todos los componentes desde el archivo principal
export { default as TableContainer } from './components/TableContainer'
export { default as TableHeader } from './components/TableHeader'
export { default as TableBody } from './components/TableBody'
export { default as TablePagination } from './components/TablePagination'
export { default as TableFilter } from './components/TableFilter'
export { createTableStore } from './TableStore'
export type { TableState, ResponseAPI, TableFilterItem, TableSorting } from './types'
