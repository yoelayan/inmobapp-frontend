// components/Table/index.tsx
import React, { useEffect } from 'react'

import { Paper } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'

import { TableProvider } from './TableContext'
import type { TableState, TableAction } from './types'

interface TableProps<T> {
  columns: ColumnDef<T, any>[]
  state: TableState<T>
  actions?: TableAction[]
  children: React.ReactNode
}

export function Table<T>({ columns, state, actions, children }: TableProps<T>) {
  useEffect(() => {
    state.fetchData()
  }, [])

  return (
    <TableProvider columns={columns} state={state} actions={actions}>
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
export { default as TableActions } from './components/TableActions'
export { createTableStore } from './TableStore'
export type { TableState, TableAction, TableActionsRenderProps } from './types'
