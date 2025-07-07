// components/TableBody.tsx
import React from 'react'

import { TableBody as MuiTableBody, TableRow, TableCell, CircularProgress, Typography } from '@mui/material'

import { flexRender } from '@tanstack/react-table'

import { useTableContext } from '../TableContext'

interface TableBodyProps {
  onRowClick?: (row: any) => void
  renderRow?: (row: any) => React.ReactNode
}

const TableBody: React.FC<TableBodyProps> = ({ onRowClick, renderRow }) => {
  const { table, state } = useTableContext()

  if (state.loading) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length} align='center' sx={{ py: 6 }}>
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
          <TableCell colSpan={table.getAllColumns().length} align='center' sx={{ py: 6 }}>
            <Typography variant='body1'>No se encontraron datos</Typography>
          </TableCell>
        </TableRow>
      </MuiTableBody>
    )
  }

  return (
    <MuiTableBody>
      {table.getRowModel().rows.map(row =>
        renderRow ? (

          // Usar render prop si está disponible
          renderRow(row)
        ) : (
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
          </TableRow>
        )
      )}
    </MuiTableBody>
  )
}

export default TableBody
