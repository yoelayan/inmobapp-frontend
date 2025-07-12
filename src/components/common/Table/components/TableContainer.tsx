import React from 'react'

import { TableContainer as MuiTableContainer, Table as MuiTable } from '@mui/material'

interface TableContainerProps {
  children: React.ReactNode
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  return (
    <MuiTableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflowX: 'auto', width: '100%' }}>
      <MuiTable
        stickyHeader
        sx={{
          tableLayout: 'auto',
          width: '100%',
          minWidth: '100%'
        }}
      >
        {children}
      </MuiTable>
    </MuiTableContainer>
  )
}

export default TableContainer
