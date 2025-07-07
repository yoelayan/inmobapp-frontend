// components/TablePagination.tsx
import React from 'react'

import { TablePagination as MuiTablePagination, Box } from '@mui/material'

import { useTableContext } from '../TableContext'

const TablePagination = () => {

  const { state } = useTableContext()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
      <MuiTablePagination
        component='div'
        count={state.totalCount}
        page={state.pageIndex}
        onPageChange={(_, newPage) => state.setPageIndex(newPage)}
        rowsPerPage={state.pageSize}
        onRowsPerPageChange={e => {
          state.setPageSize(parseInt(e.target.value, 10))
          state.setPageIndex(0) // Resetear a la primera página
        }}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage='Filas por página:'
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
      />
    </Box>
  )
}

export default TablePagination
