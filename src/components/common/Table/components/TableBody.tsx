
import React, { useMemo } from 'react'

import { TableBody as MuiTableBody, TableRow, TableCell, CircularProgress, Typography } from '@mui/material'

import { flexRender } from '@tanstack/react-table'

import { useTableContext } from '../TableContext'
import TableActions from './TableActions'

interface TableBodyProps {
  onRowClick?: (row: any) => void
  renderRow?: (row: any, actions?: React.ReactNode) => React.ReactNode
  renderActions?: (row: any) => React.ReactNode
  showActions?: boolean
}

const TableBody = React.memo<TableBodyProps>(({
  onRowClick,
  renderRow,
  renderActions,
  showActions = true
}) => {
  const { table, state, actions } = useTableContext()

  const renderedRows = useMemo(() => {
    return table.getRowModel().rows.map(row => {
      // Render actions component
      const actionsElement = (actions && showActions) ? (
        renderActions ?
          renderActions(row.original) :
          <TableActions row={row.original} actions={actions} />
      ) : null

      // Use custom renderRow if provided
      if (renderRow) {
        return renderRow(row, actionsElement)
      }

      // Default row rendering
      return (
        <TableRow
          key={row.id}
          hover
          onClick={onRowClick ? () => onRowClick(row.original) : undefined}
          sx={onRowClick ? { cursor: 'pointer' } : {}}
        >
          {row.getVisibleCells().map(cell => (
            <TableCell key={cell.id} align='left'>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
          {/* Add actions cell if actions are provided and showActions is true */}
          {(actions && showActions) && (
            <TableCell align='center' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
              {actionsElement}
            </TableCell>
          )}
        </TableRow>
      )
    })
  }, [table.getRowModel().rows, renderRow, renderActions, onRowClick, actions, showActions])

  if (state.loading) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length + (actions && showActions ? 1 : 0)} align='center' sx={{ py: 6 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      </MuiTableBody>
    )
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length + (actions && showActions ? 1 : 0)} align='center' sx={{ py: 6 }}>
            <Typography variant='body1'>No se encontraron datos</Typography>
          </TableCell>
        </TableRow>
      </MuiTableBody>
    )
  }

  return (
    <MuiTableBody>
      {renderedRows}
    </MuiTableBody>
  )
})

TableBody.displayName = 'TableBody'
export default TableBody

